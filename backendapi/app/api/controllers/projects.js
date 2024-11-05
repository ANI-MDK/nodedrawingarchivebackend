const db = require("../../../config/db")

module.exports = {
    getAll: (req, res, next) => {
        if("Y" === global.user_info[0].is_admin) {
            const sql = "SELECT id AS project_id, name AS project_name, code AS project_code, location AS project_location, state AS project_state, description AS project_description, is_active AS project_is_active FROM tbl_projects ORDER BY id DESC"
            db.query(sql, (err, project_list) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Project list", data: project_list})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getAllActiveProjectUserWise: (req, res, next) => {
        const pageName = req.params.page_name.trim()
        if("can_add" === pageName || "can_edit" === pageName) {
            let sql = ""
            if("Y" === global.user_info[0].is_admin) {
                sql = "SELECT id AS project_id, name AS project_name, code AS project_code FROM tbl_projects WHERE is_active='Y'"
            }
            else {
                const userId = global.user_info[0].id
                sql = "SELECT p.id AS project_id, p.name AS project_name, p.code AS project_code FROM tbl_projects p JOIN tbl_user_project_mapping upm ON p.id = upm.project_id WHERE upm.user_id="+db.escape(userId)+" AND upm."+pageName+"='Y' AND p.is_active='Y'"
            }
            db.query(sql, (err, projectList) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Active project list", data: projectList})
                }
            })
        }
        else {
            res.json({status: "error", message: "Something went wrong"})
        }
    },

    create: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            let projectName = req.body.project_name.trim()
            let projectCode = req.body.project_code.trim()
            let projectLocation = req.body.project_location.trim()
            let projectState = req.body.project_state.trim()
            let projectDescription = req.body.project_description.trim()
            if("" !== projectName && "" !== projectCode && "" !== projectLocation && "" !== projectState) {
                db.query("SELECT COUNT(*) AS project_count FROM tbl_projects WHERE name="+db.escape(projectName)+" OR code="+db.escape(projectCode), (err, isExist) => {
                    if(err) {
                        next(err)
                    }
                    else if(isExist[0].project_count > 0) {
                        res.json({status: "error", message: "Project already exist"})
                    }
                    else {
                        db.query("INSERT INTO tbl_projects SET name="+db.escape(projectName)+", code="+db.escape(projectCode)+", location="+db.escape(projectLocation)+", state="+db.escape(projectState)+", description="+db.escape(projectDescription), (err, projectInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(projectInfo.insertId > 0) {
                                res.json({status: "success", message: "Project successfully created"})
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
            let projectId = req.params.project_id
            let projectName = req.body.project_name.trim()
            let projectCode = req.body.project_code.trim()
            let projectLocation = req.body.project_location.trim()
            let projectState = req.body.project_state.trim()
            let projectDescription = req.body.project_description.trim()
            if(projectId > 0) {
                if("" !== projectName && "" !== projectCode && "" !== projectLocation && "" !== projectState) {
                    db.query("SELECT COUNT(*) AS project_count FROM tbl_projects WHERE id!="+db.escape(projectId)+" AND (name="+db.escape(projectName)+" OR code="+db.escape(projectCode)+")", (err, isExist) => {
                        if(err) {
                            next(err)
                        }
                        else if(isExist[0].project_count > 0) {
                            res.json({status: "error", message: "Project already exist"})
                        }
                        else {
                            db.query("UPDATE tbl_projects SET name="+db.escape(projectName)+", code="+db.escape(projectCode)+", location="+db.escape(projectLocation)+", state="+db.escape(projectState)+", description="+db.escape(projectDescription)+" WHERE id="+db.escape(projectId), (err, projectInfo) => {
                                if(err) {
                                    next(err)
                                }
                                else if(projectInfo.affectedRows === 1) {
                                    res.json({status: "success", message: "Project successfully updated"})
                                }
                                else {
                                    res.json({status: "error", message: "Something went wrong. Project not updated"})
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

    changeStatus: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            let projectId = req.params.project_id
            if(projectId > 0) {
                db.query("UPDATE tbl_projects SET is_active=CASE WHEN is_active='Y' THEN 'N' WHEN is_active='N' THEN 'Y' END WHERE is_active IN ('Y','N') AND id="+db.escape(projectId), (err, projectInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(projectInfo.affectedRows === 1) {
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
    }
}