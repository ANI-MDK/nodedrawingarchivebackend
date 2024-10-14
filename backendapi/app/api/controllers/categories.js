const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT id AS category_id, name AS category_name, is_active AS is_active FROM tbl_categories ORDER BY id DESC", (err, category_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Category list', data:category_list})
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            if(req.body.category_name != "") {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS category_count FROM tbl_categories WHERE name="+connection.escape(req.body.category_name), (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].category_count) {
                                connection.release()
                                res.json({status:'error', message:'Category already exist'})
                            }
                            else {
                                connection.query("INSERT INTO tbl_categories SET name="+connection.escape(req.body.category_name), (err, categoryInfo) => {
                                    connection.release()
                                    if(err) {
                                        next(err)
                                    }
                                    res.json({status:'success', message:'Category successfully created'})
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
            if(req.params.category_id > 0 && req.body.category_name != "" && (req.body.category_is_active == "Y" || req.body.category_is_active == "N")) {
                pool.getConnection((err, connection) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else {
                        connection.query("SELECT COUNT(*) AS category_count FROM tbl_categories WHERE id!="+connection.escape(req.params.category_id)+" AND name="+connection.escape(req.body.category_name), (err, isExist) => {
                            if(err) {
                                connection.release()
                                next(err)
                            }
                            else if(isExist[0].category_count) {
                                connection.release()
                                res.json({status:"error", message:"Category already exist"})
                            }
                            else {
                                connection.query("UPDATE tbl_categories SET name="+connection.escape(req.body.category_name)+", is_active="+connection.escape(req.body.category_is_active)+" WHERE id="+connection.escape(req.params.category_id), (err, categoryInfo) => {
                                    connection.release()
                                    if(err) {
                                        next(err)
                                    }
                                    res.json({status:"success", message:"Category successfully updated"})
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