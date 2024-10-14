const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT id AS location_id, name AS location_name, is_active AS is_active FROM tbl_mst_location ORDER BY id DESC", (err, location_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Location list', data:location_list})
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS location_count FROM tbl_mst_location WHERE name="+connection.escape(req.body.location_name), (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].location_count) {
                        connection.release()
                        res.json({status:'error', message:'Location already exist'})
                    }
                    else {
                        connection.query("INSERT INTO tbl_mst_location SET name="+connection.escape(req.body.location_name), (err, locationInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:'success', message:'Location successfully created'})
                        })
                    }
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    },

    update: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT COUNT(*) AS location_count FROM tbl_mst_location WHERE id!="+connection.escape(req.params.location_id)+" AND  name="+connection.escape(req.body.location_name), (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].location_count) {
                        connection.release()
                        res.json({status:"error", message:"Location already exist"})
                    }
                    else {
                        console.log(req.body.location_name)
                        console.log(req.body.location_is_active)
                        connection.query("UPDATE tbl_mst_location SET name="+connection.escape(req.body.location_name)+", is_active="+connection.escape(req.body.location_is_active)+" WHERE id="+connection.escape(req.params.location_id), (err, locationInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            res.json({status:"success", message:"Location successfully updated"})
                        })
                    }
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    }
}