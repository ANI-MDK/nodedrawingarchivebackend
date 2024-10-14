const pool = require("../../../config/database")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            pool.getConnection((err, connection) => {
                if(err) {
                    next(err)
                }
                connection.query("SELECT p.id AS project_id, p.name AS project_name, p.description AS project_description, p.code AS project_code, p.is_active AS project_is_active, p.location_id AS location_id, l.name AS location_name FROM tbl_projects p LEFT JOIN tbl_mst_location l ON p.location_id=l.id", (err, project_list) => {
                    connection.release()
                    if(err) {
                        next(err)
                    }
                    res.json({status:'success', message:'Project list', data:project_list})
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
                connection.query("SELECT COUNT(*) AS project_count FROM tbl_projects WHERE name="+connection.escape(req.body.project_name)+" OR code="+connection.escape(req.body.project_code), (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].project_count) {
                        connection.release()
                        res.json({status:'error', message:'Project already exist'})
                    }
                    else if(req.body.location_id > 0 && req.body.project_name != "" && req.body.project_code != "") {
                        connection.query("INSERT INTO tbl_projects SET location_id="+connection.escape(req.body.location_id)+", name="+connection.escape(req.body.project_name)+", description="+connection.escape(req.body.project_description)+", code="+connection.escape(req.body.project_code), (err, projectInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            if(projectInfo.insertId) {
                                res.json({status:'success', message:'Project successfully created'})
                            }
                            else {
                                res.json({status:'error', message:'Project not created'})
                            }
                        })
                    }
                    else {
                        res.json({status:'error', message:'Mandatory field error'})
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
                connection.query("SELECT COUNT(*) AS project_count FROM tbl_projects WHERE id!="+connection.escape(req.params.project_id)+" AND (name="+connection.escape(req.body.project_name)+" OR code="+connection.escape(req.body.project_code)+")", (err, isExist) => {
                    if(err) {
                        connection.release()
                        next(err)
                    }
                    else if(isExist[0].project_count) {
                        connection.release()
                        res.json({status:"error", message:"Project already exist"})
                    }
                    else if(req.body.location_id > 0 && req.body.project_name != "" && req.body.project_code != "" && (req.body.project_is_active == "N" || req.body.project_is_active == "Y")) {
                        connection.query("UPDATE tbl_projects SET location_id="+connection.escape(req.body.location_id)+", name="+connection.escape(req.body.project_name)+", description="+connection.escape(req.body.project_description)+", code="+connection.escape(req.body.project_code)+", is_active="+connection.escape(req.body.project_is_active)+" WHERE id="+connection.escape(req.params.project_id), (err, projectInfo) => {
                            connection.release()
                            if(err) {
                                next(err)
                            }
                            if(projectInfo.affectedRows) {
                                res.json({status:"success", message:"Project successfully updated"})
                            }
                            else {
                                res.json({status:'error', message:'Project not updated'})
                            }
                        })
                    }
                    else {
                        res.json({status:'error', message:'Mandatory field error'})
                    }
                })
            })
        }
        else {
            res.json({status:'error', message:'Permission denied'})
        }
    }
}