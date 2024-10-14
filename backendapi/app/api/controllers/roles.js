const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT id AS role_id, name AS role_name, is_active AS is_active FROM tbl_mst_roles ORDER BY id DESC", (err, role_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Role list', data:role_list})
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            if(req.body.role_name != "") {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS role_count FROM tbl_mst_roles WHERE name="+connection.escape(req.body.role_name), (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].role_count) {
                                connection.release()
                                res.json({status:'error', message:'Role already exist'})
                            }
                            else {
                                connection.query("INSERT INTO tbl_mst_roles SET name="+connection.escape(req.body.role_name), (err, roleInfo) => {
                                    connection.release()
                                    if(err) {
                                        next(err)
                                    }
                                    res.json({status:'success', message:'Role successfully created'})
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
            if(req.params.role_id > 0 && req.body.role_name != "" && (req.body.role_is_active == "Y" || req.body.role_is_active == "N")) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS role_count FROM tbl_mst_roles WHERE id!="+connection.escape(req.params.role_id)+" AND name="+connection.escape(req.body.role_name), (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].role_count) {
                                connection.release()
                                res.json({status:"error", message:"Role already exist"})
                            }
                            else {
                                connection.query("UPDATE tbl_mst_roles SET name="+connection.escape(req.body.role_name)+", is_active="+connection.escape(req.body.role_is_active)+" WHERE id="+connection.escape(req.params.role_id), (err, roleInfo) => {
                                    connection.release()
                                    if(err) {
                                        next(err)
                                    }
                                    res.json({status:"success", message:"Role successfully updated"})
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
    }
}