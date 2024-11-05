const db = require("../../../config/db")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const sql = "SELECT id AS role_id, name AS role_name, is_active AS is_active FROM tbl_roles ORDER BY id DESC"
            db.query(sql, (err, role_list) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Role list", data: role_list})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const roleName = req.body.role_name.trim()
            if(roleName !== "") {
                db.query("SELECT COUNT(*) AS role_count FROM tbl_roles WHERE name="+db.escape(roleName), (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].role_count > 0) {
                        res.json({status: "error", message: "Role already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_roles SET name="+db.escape(roleName), (err, roleInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(roleInfo.insertId > 0) {
                                res.json({status: "success", message: "Role successfully created"})
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
            const roleId = req.params.role_id
            const roleName = req.body.role_name.trim()
            if(roleId > 0) {
                if(roleName !== "") {
                    db.query("SELECT COUNT(*) AS role_count FROM tbl_roles WHERE id!="+db.escape(roleId)+" AND name="+db.escape(roleName), (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].role_count > 0) {
                            res.json({status: "error", message: "Role already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_roles SET name="+db.escape(roleName)+" WHERE id="+db.escape(roleId), (err, roleInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(roleInfo.affectedRows === 1) {
                                    res.json({status: "success", message: "Role successfully updated"})
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. Role not updated"})
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
    }
}