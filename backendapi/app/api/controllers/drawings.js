const db            = require("../../../config/db")
const uploadFiles   = require("../middlewares/upload_files")
const multer        = require("multer")
const fs            = require("fs")
const config        = require("../../../config/config") 
const path          = require("path")

insertDrawing = (req, res, next) => {
    const userId = global.user_info[0].id
    const projectId = req.body.project_id
    const categoryId = req.body.category_id
    const subCategoryId = req.body.sub_category_id || 0
    const drawingDescription = req.body.drawing_description.trim()
    const drawingNumber = req.body.drawing_number.trim()
    const drawingPassDate = req.body.drawing_pass_date || null
    const drawingRevision = req.body.drawing_revision.trim() || 0
    const drawingRevisionDate = req.body.drawing_revision_date || null
    if(projectId > 0 && categoryId > 0 && drawingDescription !== "" && drawingNumber !== "" && ((drawingRevision !== "" || drawingRevision !== "0") && drawingRevisionDate !== "") && (req.files || req.files.length !== 0)) {
        db.query("SELECT COUNT(*) AS drawing_count FROM tbl_drawings WHERE project_id="+db.escape(projectId)+" AND drg_number="+db.escape(drawingNumber)+" AND revision="+db.escape(drawingRevision)+" AND is_delete='N'", (err, isExist) => {
            if(err) {
                if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                }
                if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                }
                if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                }
                res.json({status: "error", message: "Something went wrong. Error uploading files"})
                next(err)
            }
            else if(isExist[0].drawing_count > 0) {
                res.json({status: "error", message: "Drawing already exist"})
            }
            else {
                db.query("INSERT INTO tbl_drawings SET project_id="+db.escape(projectId)+", category_id="+db.escape(categoryId)+", sub_category_id="+db.escape(subCategoryId)+", description="+db.escape(drawingDescription)+", drg_number="+db.escape(drawingNumber)+", passed_date="+db.escape(drawingPassDate)+", revision="+db.escape(drawingRevision)+", revision_date="+db.escape(drawingRevisionDate)+", added_by="+db.escape(userId), (err, drawingInfo) => {
                    if(err) {
                        if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                        }
                        if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                        }
                        if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                        }
                        next(err)
                    }
                    else if(drawingInfo.insertId > 0) {
                        const drawingIdCreated = drawingInfo.insertId
                        if(req.files.image_file && req.files.image_file.length > 0) {
                            db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingIdCreated)+", file_type="+db.escape(path.extname(req.files.image_file[0].originalname).substring(1).toUpperCase())+", original_file_name="+db.escape(req.files.image_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.image_file[0].filename))
                        }
                        if(req.files.pdf_file && req.files.pdf_file.length > 0) {
                            db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingIdCreated)+", file_type="+db.escape(path.extname(req.files.pdf_file[0].originalname).substring(1).toUpperCase())+", original_file_name="+db.escape(req.files.pdf_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.pdf_file[0].filename))
                        }
                        if(req.files.drawing_file && req.files.drawing_file.length > 0) {
                            db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingIdCreated)+", file_type="+db.escape(path.extname(req.files.drawing_file[0].originalname).substring(1).toUpperCase())+", original_file_name="+db.escape(req.files.drawing_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.drawing_file[0].filename))
                        }
                        res.json({status: "success", message: "Drawing successfully created"})
                    }
                    else {
                        if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                        }
                        if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                        }
                        if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                        }
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

module.exports = {
    getAll: (req, res, next) => {
        let sql = ""
        if("Y" === global.user_info[0].is_admin) {
            sql = "SELECT d.id AS drawing_id, d.project_id AS project_id, p.name AS project_name, p.code AS project_code, d.category_id AS category_id, c.name AS category_name, d.sub_category_id AS sub_category_id, s.name AS sub_category_name, d.description AS drawing_description, d.drg_number AS drawing_number, DATE_FORMAT(d.passed_date, '%d %b, %Y') AS drawing_passed_date, d.revision AS drawing_revision_number, d.revision_date AS drawing_revision_date, d.is_active AS drawing_is_active, 'Y' AS drawing_can_edit, 'Y' AS drawing_can_download, GROUP_CONCAT(DISTINCT dd.file_type SEPARATOR ', ') AS drawing_file_type, GROUP_CONCAT(DISTINCT CONCAT(dd.id, '|~|', dd.file_type) SEPARATOR ', ') AS drawing_file_details FROM tbl_drawings d JOIN tbl_projects p ON d.project_id=p.id JOIN tbl_categories c ON d.category_id=c.id LEFT JOIN tbl_sub_categories s ON d.sub_category_id=s.id LEFT JOIN tbl_drawing_docs dd ON d.id=dd.drawing_id WHERE d.is_delete='N' GROUP BY d.id, d.project_id, p.name, p.code, d.category_id, c.name, d.sub_category_id, s.name, d.description, d.drg_number, d.passed_date, d.revision, d.revision_date, d.is_active"
        }
        else {
            const userId = global.user_info[0].id
            sql = "SELECT d.id AS drawing_id, d.project_id AS project_id, p.name AS project_name, p.code AS project_code, d.category_id AS category_id, c.name AS category_name, d.sub_category_id AS sub_category_id, s.name AS sub_category_name, d.description AS drawing_description, d.drg_number AS drawing_number, d.passed_date AS drawing_passed_date, d.revision AS drawing_revision_number, d.revision_date AS drawing_revision_date, d.is_active AS drawing_is_active, upm.can_edit AS drawing_can_edit, upm.can_download AS drawing_can_download, GROUP_CONCAT(DISTINCT dd.file_type SEPARATOR ', ') AS drawing_file_type, GROUP_CONCAT(DISTINCT CONCAT(dd.id, '|~|', dd.file_type) SEPARATOR ', ') AS drawing_file_details FROM tbl_drawings d JOIN tbl_projects p ON d.project_id=p.id JOIN tbl_categories c ON d.category_id=c.id LEFT JOIN tbl_sub_categories s ON d.sub_category_id=s.id JOIN tbl_user_project_mapping upm ON p.id=upm.project_id LEFT JOIN tbl_drawing_docs dd ON d.id=dd.drawing_id WHERE d.is_active='Y' AND d.is_delete='N' AND upm.user_id="+db.escape(userId)+" AND upm.can_view='Y' AND p.is_active='Y' GROUP BY d.id, d.project_id, p.name, p.code, d.category_id, c.name, d.sub_category_id, s.name, d.description, d.drg_number, d.passed_date, d.revision, d.revision_date, d.is_active, upm.can_edit, upm.can_download"
        }
        db.query(sql, (err, drawingList) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "Drawing list", data: drawingList})
            }
        })
    },

    create: (req, res, next) => {
        uploadFiles.fields([
            { name: 'image_file', maxCount: 1 },
            { name: 'pdf_file', maxCount: 1 },
            { name: 'drawing_file', maxCount: 1 }
        ])(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                }
                if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                }
                if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                }
                res.json({status: "error", message: "Something went wrong. Error uploading files"})
                next(err)
            }
            else if(err) {
                if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                }
                if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                }
                if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                }
                res.json({status: "error", message: "Something went wrong. Error uploading files"})
                next(err)
            }
            else {
                if("Y" === global.user_info[0].is_admin) {
                    insertDrawing(req, res, next)
                }
                else {
                    const userId = global.user_info[0].id
                    const projectId = req.body.project_id || 0
                    db.query("SELECT can_add FROM tbl_user_project_mapping WHERE user_id="+db.escape(userId)+" AND project_id="+db.escape(projectId), (err, permissionInfo) => {
                        if(err) {
                            if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                            }
                            if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                            }
                            if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                            }
                            next(err)
                        }
                        else if("Y" === permissionInfo[0].can_add) {
                            insertDrawing(req, res, next)
                        }
                        else {
                            res.json({status: "error", message: "Permission denied"})
                        }
                    })
                }
            }
        })
    },

    changeStatus: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const drawingId = req.params.drawing_id
            if(drawingId > 0) {
                db.query("UPDATE tbl_drawings SET is_active=CASE WHEN is_active='Y' THEN 'N' WHEN is_active='N' THEN 'Y' END WHERE is_active IN ('Y','N') AND id="+db.escape(drawingId), (err, drawingInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(drawingInfo.affectedRows === 1) {
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

    delete: (req, res, next) => {
        if("Y" == global.user_info[0].is_admin) {
            const drawingId = req.params.drawing_id
            if(drawingId > 0) {
                db.query("UPDATE tbl_drawings SET is_delete='Y' WHERE id="+db.escape(drawingId), (err, drawingInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(drawingInfo.affectedRows === 1) {
                        res.json({status: "success", message: "Drawing successfully deleted"})
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. Drawing not deleted"})
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