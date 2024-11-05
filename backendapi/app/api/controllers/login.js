const db        = require("../../../config/db")
const bcrypt    = require("bcrypt")
const jwt       = require("jsonwebtoken")
const config    = require("../../../config/config")

module.exports = {
    authenticate: (req, res, next) => {
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
                            sql = "SELECT COUNT(*) AS total_count, COUNT(CASE WHEN m.can_add = 'Y' THEN 1 END) AS can_add_drawing FROM tbl_projects p INNER JOIN tbl_user_project_mapping m ON p.id=m.project_id WHERE m.user_id="+db.escape(userInfo.user_id)+" AND p.is_active='Y'"
                        }
                        else {
                            sql = "SELECT COUNT(*) AS total_count, 1 AS can_add_drawing FROM tbl_projects WHERE is_active='Y'"
                        }
                        db.query(sql, (err, associatedProjectInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if("N" == userInfo.is_admin_user && !associatedProjectInfo[0].total_count) {
                                res.json({status: "error", message: "login unavailable"})
                            }
                            else {
                                const accessToken = jwt.sign({ id: userInfo.user_id }, config.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN })
                                res.header('Authorization', accessToken).json({
                                    status: 'success',
                                    message: 'Valid user',
                                    data: {
                                        user_name: userInfo.user_name,
                                        user_email: userInfo.user_email,
                                        is_admin_user: userInfo.is_admin_user,
                                        user_role_name: ("N" == userInfo.is_admin_user) ? userInfo.user_role_name : "Admin",
                                        can_add_drawing: associatedProjectInfo[0].can_add_drawing
                                    }
                                })
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
}