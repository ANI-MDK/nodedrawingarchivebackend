const request   = require("request")
const db        = require("../../../config/db")
const bcrypt    = require("bcrypt")
const jwt       = require("jsonwebtoken")
const config    = require("../../../config/config")

// getFileCount = async (userInfo) => {
//     let sql = ""
//     if("Y" === userInfo.is_admin_user) {
//         sql = `
//         SELECT 
//             SUM(CASE WHEN dd.file_category='PDF' THEN 1 ELSE 0 END) AS total_pdf_files,
//             SUM(CASE WHEN dd.file_category='IMAGE' THEN 1 ELSE 0 END) AS total_image_files,
//             SUM(CASE WHEN dd.file_category='DRAWING' THEN 1 ELSE 0 END) AS total_drawing_files
//         FROM 
//             tbl_drawing_docs dd
//         JOIN 
//             tbl_drawings d ON d.id=dd.drawing_id
//         JOIN 
//             tbl_projects p ON p.id=d.project_id
//         WHERE
//             d.is_active='Y' AND d.is_delete='N' AND p.is_active='Y'`
//     }
//     else {
//         const userId = userInfo.user_id
//         sql = `
//         SELECT 
//             SUM(CASE WHEN dd.file_category='PDF' THEN 1 ELSE 0 END) AS total_pdf_files,
//             SUM(CASE WHEN dd.file_category='IMAGE' THEN 1 ELSE 0 END) AS total_image_files,
//             SUM(CASE WHEN dd.file_category='DRAWING' THEN 1 ELSE 0 END) AS total_drawing_files
//         FROM 
//             tbl_drawing_docs dd
//         JOIN 
//             tbl_drawings d ON d.id=dd.drawing_id
//         JOIN 
//             tbl_projects p ON p.id=d.project_id
//         JOIN 
//             tbl_user_project_mapping upm ON p.id=upm.project_id
//         WHERE 
//             d.is_active='Y' AND d.is_delete='N' AND p.is_active='Y' AND upm.user_id=${db.escape(userId)} AND upm.can_view='Y'`
//     }
    
//     return new Promise((resolve, reject) => {
//         db.query(sql, (err, fileCountDetails) => {
//             if(err) {
//                 reject(err)
//             }
//             else {
//                 resolve(fileCountDetails)
//             }
//         })
//     })
// }

module.exports = {
    authenticate: (req, res, next) => {
        const token = req.body.token
        if(token === undefined || token === "" || token === 0) {
            res.json({status: "error", message: "Something went wrong. Login unavailable"})
        }
        else {
            request(`${config.VERIFICATION_URL}?secret=${config.RECAPTCHA_SECRET}&response=${token}`, (err, verificationInfo) => {
                const { success, score } = JSON.parse(verificationInfo.body)
                if(!success && score < 0.7) {
                    res.json({status: "error", message: "Auth failed. Login unavailable"})
                }
                else {
                    const userName = req.body.username.trim()
                    const userPassword = req.body.password.trim()
                    if(userName !== "" && userPassword !== "") {
                        db.query("SELECT u.id as user_id, u.name as user_name, u.email as user_email, u.password as user_password, u.is_admin as is_admin_user, r.name as user_role_name FROM tbl_users u LEFT JOIN tbl_roles r ON u.role_id=r.id AND r.is_active='Y' WHERE u.email="+db.escape(userName)+" AND u.is_active='Y' AND u.is_delete='N'", (err, userInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(userInfo.length) {
                                userInfo = userInfo[0]
                                if("N" == userInfo.is_admin_user && null == userInfo.user_role_name) {
                                    res.json({status: "error", message: "Invalid user or login unavailable"})
                                }
                                else if(bcrypt.compareSync(userPassword, userInfo.user_password)) {
                                    let sql = ""
                                    if("N" == userInfo.is_admin_user) {
                                        sql = "SELECT COUNT(*) AS total_count, COUNT(CASE WHEN m.can_add = 'Y' THEN 1 END) AS can_add_drawing, COUNT(CASE WHEN m.can_view_download_logsheet = 'Y' THEN 1 END) AS can_view_download_logsheet FROM tbl_projects p INNER JOIN tbl_user_project_mapping m ON p.id=m.project_id WHERE m.user_id="+db.escape(userInfo.user_id)+" AND p.is_active='Y'"
                                    }
                                    else {
                                        sql = "SELECT COUNT(*) AS total_count, 1 AS can_add_drawing, 1 AS can_view_download_logsheet FROM tbl_projects WHERE is_active='Y'"
                                    }
                                    db.query(sql, async (err, associatedProjectInfo) => {
                                        if(err) {
                                            next(err)
                                        }
                                        else if("N" == userInfo.is_admin_user && !associatedProjectInfo[0].total_count) {
                                            res.json({status: "error", message: "login unavailable"})
                                        }
                                        else {
                                            try {
                                                // fileCountDetails = await getFileCount(userInfo)
                                                
                                                const accessToken = jwt.sign({ id: userInfo.user_id }, config.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN })
                                                res.header('Authorization', accessToken).json({
                                                    status: 'success',
                                                    message: 'Valid user',
                                                    data: {
                                                        user_name: userInfo.user_name,
                                                        user_email: userInfo.user_email,
                                                        is_admin_user: userInfo.is_admin_user,
                                                        user_role_name: ("N" == userInfo.is_admin_user) ? userInfo.user_role_name : "Admin",
                                                        can_add_drawing: associatedProjectInfo[0].can_add_drawing,
                                                        can_view_download_logsheet: associatedProjectInfo[0].can_view_download_logsheet,
                                                        // total_pdf_files: fileCountDetails[0].total_pdf_files
                                                    }
                                                })
                                            }
                                            catch(error) {
                                                next(error)
                                            }
                                        }
                                    })
                                }
                                else {
                                    res.json({status: "error", message: "Invalid user"})
                                }
                            }
                            else {
                                res.json({status: "error", message: "User not exist"})
                            }
                        })
                    }
                    else {
                        res.json({status: "error", message: "Mandetory field error"})
                    }
                }
            })
        }
    }
}