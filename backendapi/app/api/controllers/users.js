const db        = require("../../../config/db")
const bcrypt    = require("bcrypt")
const config    = require("../../../config/config")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const sql = "SELECT u.id AS user_id, u.role_id AS user_role_id, r.name AS user_role_name, u.name AS user_name, u.email AS user_email, u.is_active AS is_active FROM tbl_users u LEFT JOIN tbl_roles r ON u.role_id = r.id WHERE u.is_admin = 'N' AND u.is_delete = 'N'"

            // const sql = "SELECT u.id AS user_id, u.role_id AS user_role_id, r.name AS user_role_name, u.name AS user_name, u.email AS user_email, u.is_active AS is_active, GROUP_CONCAT(DISTINCT p.id SEPARATOR ', ') AS user_project_ids, GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') AS user_project_names, GROUP_CONCAT(DISTINCT CONCAT(p.id, ' - ', p.name) SEPARATOR ', ') AS user_projects FROM tbl_users u LEFT JOIN tbl_roles r ON u.role_id = r.id LEFT JOIN tbl_user_project_mapping upm ON u.id = upm.user_id LEFT JOIN tbl_projects p ON upm.project_id = p.id AND p.is_active = 'Y' WHERE u.is_admin = 'N' AND u.is_delete = 'N' GROUP BY u.id, u.role_id, r.name, u.name, u.email, u.is_active"

            db.query(sql, (err, userList) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "User list", data: userList})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const roleId = req.body.user_role_id
            const userName = req.body.user_name.trim()
            const userEmail = req.body.user_email.trim()
            const userPassword = req.body.user_password.trim()
            if(roleId > 0 && userName !== "" && userEmail !== "" && userPassword !== "") {
                db.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE email="+db.escape(userEmail)+" AND is_delete='N'", (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].user_count > 0) {
                        res.json({status: "error", message: "User already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_users SET role_id="+db.escape(roleId)+", name="+db.escape(userName)+", email="+db.escape(userEmail)+", password="+db.escape(bcrypt.hashSync(userPassword, Number(config.SALT_ROUND))), (err, userInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(userInfo.insertId > 0) {
                                res.json({status: "success", message: "User successfully created"})
                            }
                            else {
                                res.json({status: "error", message: "Something went wrong"})
                            }
                        })
                    }
                })
            }
            else {
                res.json({status: "error", message: "Mandetory field error"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    update: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const userId = req.params.user_id
            const roleId = req.body.user_role_id
            const userName = req.body.user_name.trim()
            const userEmail = req.body.user_email.trim()
            if(userId > 0) {
                if(roleId > 0 && userName !== "" && userEmail !== "") {
                    db.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE id!="+db.escape(userId)+" AND email="+db.escape(userEmail)+" AND is_delete='N'", (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].user_count > 0) {
                            res.json({status: "error", message: "User already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_users SET role_id="+db.escape(roleId)+", name="+db.escape(userName)+", email="+db.escape(userEmail)+" WHERE id="+db.escape(userId), (err, userInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(userInfo.affectedRows === 1) {
                                    res.json({status: "success", message: "User successfully updated"})
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. User not updated"})
                                }
                            })
                        }
                    })
                }
                else {
                    res.json({status: "error", message: "Mandetory field error"})
                }
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    updatePassword: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const userId = req.params.user_id
            const userPassword = req.body.user_password.trim()
            if(userId > 0) {
                if(userPassword !== "") {
                    db.query("UPDATE tbl_users SET password="+db.escape(bcrypt.hashSync(userPassword, Number(config.SALT_ROUND)))+" WHERE id="+db.escape(userId), (err, userInfo) => {
                        if(err) {
                            next(err)
                        }
                        else if(userInfo.affectedRows === 1) {
                            res.json({status: "success", message: "Password successfully updated"})
                        }
                        else {
                            res.json({status: "error", message: "Something went wrong. Password not updated"})
                        }
                    })
                }
                else {
                    res.json({status: "error", message: "Mandetory field error"})
                }
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    delete: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const userId = req.params.user_id
            if(userId > 0) {
                db.query("UPDATE tbl_users SET is_delete='Y' WHERE id="+db.escape(userId), (err, userInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(userInfo.affectedRows === 1) {
                        res.json({status: "success", message: "User successfully deleted"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. User not deleted"})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    changeStatus: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const userId = req.params.user_id
            if(userId > 0) {
                db.query("UPDATE tbl_users SET is_active=CASE WHEN is_active='Y' THEN 'N' WHEN is_active='N' THEN 'Y' END WHERE is_active IN ('Y','N') AND id="+db.escape(userId), (err, userInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(userInfo.affectedRows === 1) {
                        res.json({status: "success", message: "Status successfully updated"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. Status not updated"})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getPermission: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const userId = req.params.user_id
            if(userId > 0) {
                const sql = "SELECT p.id AS project_id, p.name AS project_name, COALESCE(upm.can_view, 'N') AS can_view, COALESCE(upm.can_add, 'N') AS can_add, COALESCE(upm.can_edit, 'N') AS can_edit, COALESCE(upm.can_download, 'N') AS can_download FROM tbl_projects p LEFT JOIN tbl_user_project_mapping upm ON p.id = upm.project_id AND upm.user_id = "+db.escape(userId)+" WHERE p.is_active = 'Y' ORDER BY p.name ASC"
                db.query(sql, (err, userPermissionList) => {
                    if(err) {
                        next(err)
                    }
                    else {
                        res.json({status: "success", message: "User permission list", data: userPermissionList})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    setPermission: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const userId = req.body.user_id
            const projectId = req.body.project_id 
            const fieldName = req.body.field_name.trim()
            const fieldValue = req.body.field_value.trim()
            if(userId > 0 && projectId > 0 && fieldName !== "" && (fieldValue === "Y" || fieldValue === "N")) {
                db.query("SELECT COUNT(*) AS mapping_count FROM tbl_user_project_mapping WHERE user_id="+db.escape(userId)+" AND project_id="+db.escape(projectId), (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].mapping_count === 0) {
                        const sql = "INSERT INTO tbl_user_project_mapping SET user_id="+db.escape(userId)+", project_id="+db.escape(projectId)+", "+fieldName+"="+db.escape(fieldValue)
                        // console.log(sql)
                        db.query(sql, (err, mappingInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(mappingInfo.insertId > 0) {
                                res.json({status: "success", message: "Permission successfully updated"})
                            }
                            else {
                                res.json({status: "error", message: "Something went wrong. Permission not inserted"})
                            }
                        })
                    }
                    else if(isExist[0].mapping_count === 1) {
                        const sql = "UPDATE tbl_user_project_mapping SET "+fieldName+"="+db.escape(fieldValue)+" WHERE user_id="+db.escape(userId)+" AND project_id="+db.escape(projectId)
                        // console.log(sql)
                        db.query(sql, (err, mappingInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(mappingInfo.affectedRows === 1) {
                                res.json({status: "success", message: "Permission successfully updated"})
                            }
                            else {
                                res.json({status: "error", message: "Something went wrong. Permission not updated"})
                            }
                        })
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. Permission not set"})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    }
}