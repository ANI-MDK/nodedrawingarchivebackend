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
    const drawingPageNumber = req.body.drawing_page.trim() || 0
    const drawingPassDate = req.body.drawing_pass_date || null
    const drawingRevision = req.body.drawing_revision.trim() || 0
    const drawingRevisionDate = req.body.drawing_revision_date || null
    if(projectId > 0 && categoryId > 0 && drawingDescription !== "" && drawingNumber !== "" && drawingPageNumber > 0 && ((drawingRevision !== "" || drawingRevision !== "0") && drawingRevisionDate !== "") && (req.files || req.files.length !== 0)) {
        db.query("SELECT COUNT(*) AS drawing_count FROM tbl_drawings WHERE project_id="+db.escape(projectId)+" AND drg_number="+db.escape(drawingNumber)+" AND page_number="+db.escape(drawingPageNumber)+" AND revision="+db.escape(drawingRevision)+" AND is_delete='N'", (err, isExist) => {
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
                // res.json({status: "error", message: "Something went wrong. Error uploading files"})
                next(err)
            }
            else if(isExist[0].drawing_count > 0) {
                if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                }
                if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                }
                if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                }
                res.json({status: "error", message: "Drawing already exist"})
            }
            else {
                db.query("INSERT INTO tbl_drawings SET project_id="+db.escape(projectId)+", category_id="+db.escape(categoryId)+", sub_category_id="+db.escape(subCategoryId)+", description="+db.escape(drawingDescription)+", drg_number="+db.escape(drawingNumber)+", page_number="+db.escape(drawingPageNumber)+", passed_date="+db.escape(drawingPassDate)+", revision="+db.escape(drawingRevision)+", revision_date="+db.escape(drawingRevisionDate)+", added_by="+db.escape(userId), (err, drawingInfo) => {
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
                            db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingIdCreated)+", file_type="+db.escape(path.extname(req.files.image_file[0].originalname).substring(1).toUpperCase())+", file_category='IMAGE', original_file_name="+db.escape(req.files.image_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.image_file[0].filename))
                        }
                        if(req.files.pdf_file && req.files.pdf_file.length > 0) {
                            db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingIdCreated)+", file_type="+db.escape(path.extname(req.files.pdf_file[0].originalname).substring(1).toUpperCase())+", file_category='PDF', original_file_name="+db.escape(req.files.pdf_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.pdf_file[0].filename))
                        }
                        if(req.files.drawing_file && req.files.drawing_file.length > 0) {
                            db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingIdCreated)+", file_type="+db.escape(path.extname(req.files.drawing_file[0].originalname).substring(1).toUpperCase())+", file_category='DRAWING', original_file_name="+db.escape(req.files.drawing_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.drawing_file[0].filename))
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
        if(req.files && req.files.image_file && req.files.image_file.length > 0) {
            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
        }
        if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
        }
        if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
            fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
        }
        res.json({status: "error", message: "Mandetory field error"})
    }
}

updateDrawing = (req, res, next) => {
    const drawingId = req.params.drawing_id
    const oldImageId = req.body.old_image_id 
    const oldPdfId = req.body.old_pdf_id 
    const oldDrawingId = req.body.old_drawing_id 
    const isDeleteOldImage = req.body.is_delete_old_image 
    const isDeleteOldPdf = req.body.is_delete_old_pdf
    const isDeleteOldDrawing = req.body.is_delete_old_drawing
    // console.log(req.body)
    // console.log(req.files)
    if(drawingId > 0 && (oldImageId > 0 || oldPdfId > 0 || oldDrawingId > 0)) {
        const userId = global.user_info[0].id 
        const projectId = req.body.project_id
        const categoryId = req.body.category_id
        const subCategoryId = req.body.sub_category_id || 0
        const drawingDescription = req.body.drawing_description.trim()
        const drawingNumber = req.body.drawing_number.trim()
        const drawingPageNumber = req.body.drawing_page.trim() || 0
        const drawingPassDate = req.body.drawing_pass_date || null
        const drawingRevision = req.body.drawing_revision.trim() || 0
        const drawingRevisionDate = req.body.drawing_revision_date || null
        if(projectId > 0 && categoryId > 0 && drawingDescription !== "" && drawingNumber !== "" && drawingPageNumber > 0 && ((drawingRevision !== "" || drawingRevision !== "0") && drawingRevisionDate !== "")) {
            db.query("SELECT COUNT(*) AS drawing_count FROM tbl_drawings WHERE id!="+db.escape(drawingId)+" AND project_id="+db.escape(projectId)+" AND drg_number="+db.escape(drawingNumber)+" AND page_number="+db.escape(drawingPageNumber)+" AND revision="+db.escape(drawingRevision)+" AND is_delete='N'", (err, isExist) => {
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
                    // res.json({status: "error", message: "Something went wrong. Error uploading files"})
                    next(err)
                }
                else if(isExist[0].drawing_count > 0) {
                    if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                        fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                    }
                    if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                        fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                    }
                    if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                        fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                    }
                    res.json({status: "error", message: "Drawing already exist"})
                }
                else {
                    db.query("UPDATE tbl_drawings SET project_id="+db.escape(projectId)+", category_id="+db.escape(categoryId)+", sub_category_id="+db.escape(subCategoryId)+", description="+db.escape(drawingDescription)+", drg_number="+db.escape(drawingNumber)+", page_number="+db.escape(drawingPageNumber)+", passed_date="+db.escape(drawingPassDate)+", revision="+db.escape(drawingRevision)+", revision_date="+db.escape(drawingRevisionDate)+", updated_by="+db.escape(userId)+", updated_on=now() WHERE id="+db.escape(drawingId), (err, drawingInfo) => {
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
                        else if(drawingInfo.affectedRows === 1) {
                            if(req.files.image_file && req.files.image_file.length > 0) {
                                // console.log(1)
                                if(oldImageId > 0) {
                                    // console.log(2)
                                    db.query("SELECT uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(oldImageId)+" AND drawing_id="+db.escape(drawingId)+" AND file_category='IMAGE'", (err, oldImageInfo) => {
                                        // console.log(oldImageInfo.length)
                                        if(err) {
                                            // console.log(3)
                                            if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                                            }
                                            next(err)
                                        }
                                        else if(oldImageInfo.length) {
                                            // console.log(4)
                                            // console.log(config.UPLOAD_FILES_DIR+oldImageInfo[0].uploaded_file_name)
                                            db.query("DELETE FROM tbl_drawing_docs WHERE id="+db.escape(oldImageId)+" AND drawing_id="+db.escape(drawingId), (err, oldImageDeleteInfo) => {
                                                if(err) {
                                                    // console.log(5)
                                                    if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                                                        fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                                                    }
                                                    next(err)
                                                }
                                                else {
                                                    // console.log(6)
                                                    db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingId)+", file_type="+db.escape(path.extname(req.files.image_file[0].originalname).substring(1).toUpperCase())+", file_category='IMAGE', original_file_name="+db.escape(req.files.image_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.image_file[0].filename))
                                                    fs.unlinkSync(config.UPLOAD_FILES_DIR+oldImageInfo[0].uploaded_file_name)
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    // console.log(7)
                                    db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingId)+", file_type="+db.escape(path.extname(req.files.image_file[0].originalname).substring(1).toUpperCase())+", file_category='IMAGE', original_file_name="+db.escape(req.files.image_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.image_file[0].filename))
                                }
                            }
                            else if(oldImageId > 0 && isDeleteOldImage == "true") {
                                // console.log(8)
                                db.query("SELECT uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(oldImageId)+" AND drawing_id="+db.escape(drawingId)+" AND file_category='IMAGE'", (err, oldImageInfo) => {
                                    if(err) {
                                        next(err)
                                    }
                                    else if(oldImageInfo.length) {
                                        // console.log(9)
                                        db.query("DELETE FROM tbl_drawing_docs WHERE id="+db.escape(oldImageId)+" AND drawing_id="+db.escape(drawingId), (err, oldImageDeleteInfo) => {
                                            if(err) {
                                                next(err)
                                            }
                                            else {
                                                // console.log(10)
                                                fs.unlinkSync(config.UPLOAD_FILES_DIR+oldImageInfo[0].uploaded_file_name)
                                            }
                                        })
                                    }
                                })
                            }
                            if(req.files.pdf_file && req.files.pdf_file.length > 0) {
                                // console.log(11)
                                if(oldPdfId > 0) {
                                    // console.log(12)
                                    db.query("SELECT uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(oldPdfId)+" AND drawing_id="+db.escape(drawingId)+" AND file_category='PDF'", (err, oldPdfInfo) => {
                                        if(err) {
                                            if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                                            }
                                            next(err)
                                        }
                                        else if(oldPdfInfo.length) {
                                            // console.log(13)
                                            db.query("DELETE FROM tbl_drawing_docs WHERE id="+db.escape(oldPdfId)+" AND drawing_id="+db.escape(drawingId), (err, oldPdfDeleteInfo) => {
                                                if(err) {
                                                    if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                                                        fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                                                    }
                                                    next(err)
                                                }
                                                else {
                                                    // console.log(14)
                                                    db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingId)+", file_type="+db.escape(path.extname(req.files.pdf_file[0].originalname).substring(1).toUpperCase())+", file_category='PDF', original_file_name="+db.escape(req.files.pdf_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.pdf_file[0].filename))
                                                    fs.unlinkSync(config.UPLOAD_FILES_DIR+oldPdfInfo[0].uploaded_file_name)
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    // console.log(15)
                                    db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingId)+", file_type="+db.escape(path.extname(req.files.pdf_file[0].originalname).substring(1).toUpperCase())+", file_category='PDF', original_file_name="+db.escape(req.files.pdf_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.pdf_file[0].filename))
                                }
                            }
                            else if(oldPdfId > 0 && isDeleteOldPdf == "true") {
                                // console.log(16)
                                db.query("SELECT uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(oldPdfId)+" AND drawing_id="+db.escape(drawingId)+" AND file_category='PDF'", (err, oldPdfInfo) => {
                                    if(err) {
                                        next(err)
                                    }
                                    else if(oldPdfInfo.length) {
                                        // console.log(17)
                                        db.query("DELETE FROM tbl_drawing_docs WHERE id="+db.escape(oldPdfId)+" AND drawing_id="+db.escape(drawingId), (err, oldPdfDeleteInfo) => {
                                            if(err) {
                                                next(err)
                                            }
                                            else {
                                                // console.log(26)
                                                fs.unlinkSync(config.UPLOAD_FILES_DIR+oldPdfInfo[0].uploaded_file_name)
                                            }
                                        })
                                    }
                                })
                            }
                            if(req.files.drawing_file && req.files.drawing_file.length > 0) {
                                // console.log(18)
                                if(oldDrawingId > 0) {
                                    // console.log(19)
                                    db.query("SELECT uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(oldDrawingId)+" AND drawing_id="+db.escape(drawingId)+" AND file_category='DRAWING'", (err, oldDrawingInfo) => {
                                        if(err) {
                                            if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                                            }
                                            next(err)
                                        }
                                        else if(oldDrawingInfo.length) {
                                            // console.log(20)
                                            db.query("DELETE FROM tbl_drawing_docs WHERE id="+db.escape(oldDrawingId)+" AND drawing_id="+db.escape(drawingId), (err, oldDrawingDeleteInfo) => {
                                                if(err) {
                                                    if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                                                        fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                                                    }
                                                    next(err)
                                                }
                                                else {
                                                    // console.log(21)
                                                    db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingId)+", file_type="+db.escape(path.extname(req.files.drawing_file[0].originalname).substring(1).toUpperCase())+", file_category='DRAWING', original_file_name="+db.escape(req.files.drawing_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.drawing_file[0].filename))
                                                    fs.unlinkSync(config.UPLOAD_FILES_DIR+oldDrawingInfo[0].uploaded_file_name)
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    // console.log(22)
                                    db.execute("INSERT INTO tbl_drawing_docs SET drawing_id="+db.escape(drawingId)+", file_type="+db.escape(path.extname(req.files.drawing_file[0].originalname).substring(1).toUpperCase())+", file_category='DRAWING', original_file_name="+db.escape(req.files.drawing_file[0].originalname)+", uploaded_file_name="+db.escape(req.files.drawing_file[0].filename))
                                }
                            }
                            else if(oldDrawingId > 0 && isDeleteOldDrawing == "true") {
                                // console.log(23)
                                db.query("SELECT uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(oldDrawingId)+" AND drawing_id="+db.escape(drawingId)+" AND file_category='DRAWING'", (err, oldDrawingInfo) => {
                                    if(err) {
                                        next(err)
                                    }
                                    else if(oldDrawingInfo.length) {
                                        // console.log(24)
                                        db.query("DELETE FROM tbl_drawing_docs WHERE id="+db.escape(oldDrawingId)+" AND drawing_id="+db.escape(drawingId), (err, oldDrawingDeleteInfo) => {
                                            if(err) {
                                                next(err)
                                            }
                                            else {
                                                // console.log(25)
                                                fs.unlinkSync(config.UPLOAD_FILES_DIR+oldDrawingInfo[0].uploaded_file_name)
                                            }
                                        })
                                    }
                                })
                            }
                            res.json({status: "success", message: "Drawing successfully updated"})
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
                            res.json({status: "error", message: "Something went wrong. Drawing not updated"})
                        }
                    })
                }
            })
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
            res.json({status: "error", message: "Mandetory field error"})
        }
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
}

downloadDrawing = (req, res, next) => {
    const userId = global.user_info[0].id
    const drawingId = req.body.drawing_id || 0
    const drawingFileId = req.body.drawing_file_id || 0
    const downloadReason = req.body.download_reason.trim()
    if(drawingId > 0 && drawingFileId > 0) {
        if(downloadReason !== "") {
            db.query("SELECT file_type, original_file_name, uploaded_file_name FROM tbl_drawing_docs WHERE id="+db.escape(drawingFileId)+" AND drawing_id="+db.escape(drawingId), (err, downloadFileInfo) => {
                if(err) {
                    next(err)
                }
                else if(downloadFileInfo.length) {
                    const downloadFileType = downloadFileInfo[0].file_type
                    const downloadFileOriginalName = downloadFileInfo[0].original_file_name
                    const downloadFileName = downloadFileInfo[0].uploaded_file_name
                    const downloadFileURL = config.UPLOAD_FILES_DIR+downloadFileName
                    if(fs.existsSync(downloadFileURL)) {
                        db.query("INSERT INTO tbl_download_logsheet SET user_id="+db.escape(userId)+", drawing_id="+db.escape(drawingId)+", download_reason="+db.escape(downloadReason)+", download_file_type="+db.escape(downloadFileType)+", download_file_original_name="+db.escape(downloadFileOriginalName), (err, downloadLogInfo) => {
                            if(err) {
                                next(err)
                            }
                            else if(downloadLogInfo.insertId > 0) {
                                const stream = fs.createReadStream(downloadFileURL)
                                res.set({
                                    "Content-Disposition": `attachment; filename=${downloadFileOriginalName}`,
                                    "Content-Type": "application/octet-stream"
                                })
                                stream.pipe(res)
                            }
                            else {
                                res.json({status: "error", message: "Something went wrong. Not able to download file"})
                            }
                        })
                    }
                    else {
                        res.json({status: "error", message: "Something went wrong. File not found"})
                    }
                }
                else {
                    res.json({status: "error", message: "File not found"})
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

module.exports = {
    getAll: (req, res, next) => {
        let sql = ""
        if("Y" === global.user_info[0].is_admin) {
            sql = "SELECT d.id AS drawing_id, d.project_id AS project_id, p.name AS project_name, p.code AS project_code, d.category_id AS category_id, c.name AS category_name, d.sub_category_id AS sub_category_id, s.name AS sub_category_name, d.description AS drawing_description, d.drg_number AS drawing_number, d.page_number AS page_number, DATE_FORMAT(d.passed_date, '%Y-%m-%d') AS drawing_passed_date, d.revision AS drawing_revision_number, DATE_FORMAT(d.revision_date, '%Y-%m-%d') AS drawing_revision_date, d.is_active AS drawing_is_active, 'Y' AS drawing_can_edit, 'Y' AS drawing_can_download, GROUP_CONCAT(DISTINCT dd.file_type SEPARATOR ', ') AS drawing_file_type, GROUP_CONCAT(DISTINCT CONCAT(dd.id, '|~|', dd.file_type, '|~|', dd.original_file_name) SEPARATOR ', ') AS drawing_file_details FROM tbl_drawings d JOIN tbl_projects p ON d.project_id=p.id JOIN tbl_categories c ON d.category_id=c.id LEFT JOIN tbl_sub_categories s ON d.sub_category_id=s.id LEFT JOIN tbl_drawing_docs dd ON d.id=dd.drawing_id WHERE d.is_delete='N' GROUP BY d.id, d.project_id, p.name, p.code, d.category_id, c.name, d.sub_category_id, s.name, d.description, d.drg_number, d.passed_date, d.revision, d.revision_date, d.is_active ORDER BY drawing_id DESC"
        }
        else {
            const userId = global.user_info[0].id
            sql = "SELECT d.id AS drawing_id, d.project_id AS project_id, p.name AS project_name, p.code AS project_code, d.category_id AS category_id, c.name AS category_name, d.sub_category_id AS sub_category_id, s.name AS sub_category_name, d.description AS drawing_description, d.drg_number AS drawing_number, d.page_number AS page_number, DATE_FORMAT(d.passed_date, '%Y-%m-%d') AS drawing_passed_date, d.revision AS drawing_revision_number, DATE_FORMAT(d.revision_date, '%Y-%m-%d') AS drawing_revision_date, d.is_active AS drawing_is_active, upm.can_edit AS drawing_can_edit, upm.can_download AS drawing_can_download, GROUP_CONCAT(DISTINCT dd.file_type SEPARATOR ', ') AS drawing_file_type, GROUP_CONCAT(DISTINCT CONCAT(dd.id, '|~|', dd.file_type, '|~|', dd.original_file_name) SEPARATOR ', ') AS drawing_file_details FROM tbl_drawings d JOIN tbl_projects p ON d.project_id=p.id JOIN tbl_categories c ON d.category_id=c.id LEFT JOIN tbl_sub_categories s ON d.sub_category_id=s.id JOIN tbl_user_project_mapping upm ON p.id=upm.project_id LEFT JOIN tbl_drawing_docs dd ON d.id=dd.drawing_id WHERE d.is_active='Y' AND d.is_delete='N' AND upm.user_id="+db.escape(userId)+" AND upm.can_view='Y' AND p.is_active='Y' GROUP BY d.id, d.project_id, p.name, p.code, d.category_id, c.name, d.sub_category_id, s.name, d.description, d.drg_number, d.passed_date, d.revision, d.revision_date, d.is_active, upm.can_edit, upm.can_download ORDER BY drawing_id DESC"
        }
        db.query(sql, (err, drawingList) => {
            if(err) {
                next(err)
            }
            else {
                // console.log(drawingList)
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
            if(err instanceof multer.MulterError) {
                /*if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                }
                if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                }
                if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                }*/
                // res.json({status: "error", message: "Something went wrong. Error uploading files"})
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
                // res.json({status: "error", message: "Something went wrong. Error uploading files"})
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
                            if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                            }
                            if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                            }
                            if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                                fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                            }
                            res.json({status: "error", message: "Permission denied"})
                        }
                    })
                }
            }
        })
    },

    update: (req, res, next) => {
        uploadFiles.fields([
            { name: 'image_file', maxCount: 1 },
            { name: 'pdf_file', maxCount: 1 },
            { name: 'drawing_file', maxCount: 1 }
        ])(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                /*if(req.files && req.files.image_file && req.files.image_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.image_file[0].filename)
                }
                if(req.files && req.files.pdf_file && req.files.pdf_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.pdf_file[0].filename)
                }
                if(req.files && req.files.drawing_file && req.files.drawing_file.length > 0) {
                    fs.unlinkSync(config.UPLOAD_FILES_DIR+req.files.drawing_file[0].filename)
                }*/
                // res.json({status: "error", message: "Something went wrong. Error uploading files"})
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
                // res.json({status: "error", message: "Something went wrong. Error uploading files"})
                next(err)
            }
            else {
                if("Y" === global.user_info[0].is_admin) {
                    updateDrawing(req, res, next)
                }
                else {
                    const userId = global.user_info[0].id
                    const projectId = req.body.project_id || 0
                    db.query("SELECT can_edit FROM tbl_user_project_mapping WHERE user_id="+db.escape(userId)+" AND project_id="+db.escape(projectId), (err, permissionInfo) => {
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
                        else if("Y" === permissionInfo[0].can_edit) {
                            updateDrawing(req, res, next)
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
                        db.query("SELECT id, uploaded_file_name FROM tbl_drawing_docs WHERE drawing_id="+db.escape(drawingId), (err, drawingDetailsInfo) => {
                            if(err) {
                                db.execute("UPDATE tbl_drawings SET is_delete='N' WHERE id="+db.escape(drawingId))
                                next(err)
                            }
                            else {
                                // console.log(drawingDetailsInfo)
                                drawingDetailsInfo.map((objDd) => {
                                    // console.log(objDd.id+" => "+config.UPLOAD_FILES_DIR+objDd.uploaded_file_name)
                                    fs.unlinkSync(config.UPLOAD_FILES_DIR+objDd.uploaded_file_name)
                                })
                                db.execute("DELETE FROM tbl_drawing_docs WHERE drawing_id="+db.escape(drawingId))
                                res.json({status: "success", message: "Drawing successfully deleted"})
                            }
                        })
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
    },

    download: (req, res, next) => {
        if("Y" === global.user_info[0].is_admin) {
            downloadDrawing(req, res, next)
        }
        else {
            const userId = global.user_info[0].id
            const projectId = req.body.project_id || 0
            if(projectId > 0) {
                db.query("SELECT can_download FROM tbl_user_project_mapping WHERE user_id="+db.escape(userId)+" AND project_id="+db.escape(projectId), (err, permissionInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if("Y" === permissionInfo[0].can_download) {
                        downloadDrawing(req, res, next)
                    }
                    else {
                        res.json({status: "error", message: "Permission denied"})
                    }
                })
            }
            else {
                res.json({status: "error", message: "Something went wrong"})
            }
        }
    }
}