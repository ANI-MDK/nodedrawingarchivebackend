const pool      = require("../../../config/database")
const bcrypt    = require("bcrypt")
const config    = require("../../../config/config")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    connection.release()
                    next(err)
                }
                else {
                    connection.query("SELECT u.id AS user_id, u.role_id AS user_role_id, u.name AS user_name, u.email AS user_email, u.can_view_drawings AS user_can_view_drawings, u.can_add_drawings AS user_can_add_drawings, u.can_modify_drawings AS user_can_modify_drawings, u.can_download_drawings AS user_can_download_drawings, u.is_active AS user_is_active, r.name AS user_role_name FROM tbl_users u LEFT JOIN tbl_mst_roles r ON u.role_id=r.id WHERE u.is_admin='N' AND u.is_delete='N' ORDER BY u.id DESC", (err, user_list) => {
                        connection.release()
                        if(err) {
                            next(err)
                        }
                        res.json({status:'success', message:'User list', data:user_list})
                    })
                }
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            if(req.body.user_role_id > 0 && req.body.user_name != "" && req.body.user_email != "" && req.body.user_password != "" && (req.body.user_can_view_drawings == "Y" || req.body.user_can_view_drawings == "N") && (req.body.user_can_add_drawings == "Y" || req.body.user_can_add_drawings == "N") && (req.body.user_can_modify_drawings == "Y" || req.body.user_can_modify_drawings == "N") && (req.body.user_can_download_drawings == "Y" || req.body.user_can_download_drawings == "N")) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE email="+connection.escape(req.body.user_email)+" AND is_delete='N'", (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].user_count) {
                                connection.release()
                                res.json({status:'error', message:'User already exist'})
                            }
                            else {
                                connection.query("INSERT INTO tbl_users SET role_id="+connection.escape(req.body.user_role_id)+", name="+connection.escape(req.body.user_name)+", email="+connection.escape(req.body.user_email)+", password="+connection.escape(bcrypt.hashSync(req.body.user_password, Number(config.SALT_ROUND)))+", can_view_drawings="+connection.escape(req.body.user_can_view_drawings)+", can_add_drawings="+connection.escape(req.body.user_can_add_drawings)+", can_modify_drawings="+connection.escape(req.body.user_can_modify_drawings)+", can_download_drawings="+connection.escape(req.body.user_can_download_drawings), (err, userInfo) => {
                                    connection.release()
                                    if(err) {
                                        next(err)
                                    }
                                    res.json({status:'success', message:'User successfully created'})
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.json({status:"error", message:"Mandetory field error"})
            }
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    update: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            if(req.params.user_id > 0 && req.body.user_role_id > 0 && req.body.user_name != "" && req.body.user_email != "" && (req.body.user_can_view_drawings == "Y" || req.body.user_can_view_drawings == "N") && (req.body.user_can_add_drawings == "Y" || req.body.user_can_add_drawings == "N") && (req.body.user_can_modify_drawings == "Y" || req.body.user_can_modify_drawings == "N") && (req.body.user_can_download_drawings == "Y" || req.body.user_can_download_drawings == "N") && (req.body.user_is_active != "Y" || req.body.user_is_active != "N")) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS user_count FROM tbl_users WHERE id!="+connection.escape(req.params.user_id)+" AND email="+connection.escape(req.body.user_email)+" AND is_delete='N'", (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].user_count) {
                                connection.release()
                                res.json({status:"error", message:"User already exist"})
                            }
                            else {
                                connection.query("UPDATE tbl_users SET role_id="+connection.escape(req.body.user_role_id)+", name="+connection.escape(req.body.user_name)+", email="+connection.escape(req.body.user_email)+", can_view_drawings="+connection.escape(req.body.user_can_view_drawings)+", can_add_drawings="+connection.escape(req.body.user_can_add_drawings)+", can_modify_drawings="+connection.escape(req.body.user_can_modify_drawings)+", can_download_drawings="+connection.escape(req.body.user_can_download_drawings)+", is_active="+connection.escape(req.body.user_is_active)+" WHERE id="+connection.escape(req.params.user_id), (err, userInfo) => {
                                    connection.release()
                                    if(err) {
                                        next(err)
                                    }
                                    res.json({status:"success", message:"User successfully updated"})
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.json({status:"error", message:"Mandetory field error"})
            }
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    },

    updatePassword: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            if(req.params.user_id > 0 && req.body.user_password != "") {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("UPDATE tbl_users SET password="+connection.escape(bcrypt.hashSync(req.body.user_password, Number(config.SALT_ROUND)))+" WHERE id="+connection.escape(req.params.user_id), (err, userInfo) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(userInfo.affectedRows) {
                                connection.release()
                                res.json({status:"success", message:"Password successfully updated"})
                            }
                            else {
                                connection.release()
                                res.json({status:"error", message:"Password not updated"})
                            }
                        })
                    }
                })
            }
            else {
                res.json({status:"error", message:"Mandetory field error"})
            }
        }
        else {
            res.json({status:"error", message:"Permission denied"})
        }
    }
}