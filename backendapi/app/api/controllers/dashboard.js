const db = require("../../../config/db")

module.exports = {
    getFileCount: (req, res, next) => {
        let sql = ""
        if("Y" === global.user_info[0].is_admin) {
            sql = `
            SELECT 
                SUM(CASE WHEN dd.file_category='PDF' THEN 1 ELSE 0 END) AS total_pdf_files,
                SUM(CASE WHEN dd.file_category='IMAGE' THEN 1 ELSE 0 END) AS total_image_files,
                SUM(CASE WHEN dd.file_category='DRAWING' THEN 1 ELSE 0 END) AS total_drawing_files
            FROM 
                tbl_drawing_docs dd
            JOIN 
                tbl_drawings d ON d.id=dd.drawing_id
            JOIN 
                tbl_projects p ON p.id=d.project_id
            WHERE
                d.is_active='Y' AND d.is_delete='N' AND p.is_active='Y'`
        }
        else {
            const userId = global.user_info[0].id
            sql = `
            SELECT 
                SUM(CASE WHEN dd.file_category='PDF' THEN 1 ELSE 0 END) AS total_pdf_files,
                SUM(CASE WHEN dd.file_category='IMAGE' THEN 1 ELSE 0 END) AS total_image_files,
                SUM(CASE WHEN dd.file_category='DRAWING' THEN 1 ELSE 0 END) AS total_drawing_files
            FROM 
                tbl_drawing_docs dd
            JOIN 
                tbl_drawings d ON d.id=dd.drawing_id
            JOIN 
                tbl_projects p ON p.id=d.project_id
            JOIN 
                tbl_user_project_mapping upm ON p.id=upm.project_id
            WHERE 
                d.is_active='Y' AND d.is_delete='N' AND p.is_active='Y' AND upm.user_id=${db.escape(userId)} AND upm.can_view='Y'`
        }
        db.query(sql, (err, fileCountDetails) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "File Count Details", data: fileCountDetails})
            }
        })
    },

    getProjectCount: (req, res, next) => {
        let sql = ""
        if("Y" === global.user_info[0].is_admin) {
            sql = `
            SELECT 
                SUM(CASE WHEN is_active='Y' THEN 1 ELSE 0 END) AS total_active_projects,
                SUM(CASE WHEN is_active='N' THEN 1 ELSE 0 END) AS total_inactive_projects
            FROM
                tbl_projects p`
        }
        else {
            const userId = global.user_info[0].id
            sql = `
            SELECT 
                SUM(CASE WHEN is_active='Y' THEN 1 ELSE 0 END) AS total_active_projects,
                SUM(CASE WHEN is_active='N' THEN 1 ELSE 0 END) AS total_inactive_projects
            FROM
                tbl_projects p
            JOIN 
            tbl_user_project_mapping upm ON p.id=upm.project_id
            WHERE
                upm.user_id=${db.escape(userId)} AND upm.can_view='Y'`
        }
        db.query(sql, (err, projectCountDetails) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "Project Count Details", data: projectCountDetails})
            }
        })
    },

    getDownloadCount: (req, res, next) => {
        let sql = ""
        if("Y" === global.user_info[0].is_admin) {
            sql = `
            SELECT 
                COUNT(*) AS total_download
            FROM 
                tbl_download_logsheet dl
            JOIN 
                tbl_drawings d ON d.id=dl.drawing_id
            JOIN 
                tbl_projects p ON p.id=d.project_id
            WHERE 
                d.is_active='Y' AND d.is_delete='N' AND p.is_active='Y'`
        }
        else {
            const userId = global.user_info[0].id
            sql = `
            SELECT 
                COUNT(*) AS total_download
            FROM 
                tbl_download_logsheet dl
            JOIN 
                tbl_drawings d ON d.id=dl.drawing_id
            JOIN 
                tbl_projects p ON p.id=d.project_id
            JOIN 
                tbl_user_project_mapping upm ON p.id=upm.project_id
            WHERE 
                dl.user_id=${db.escape(userId)} AND d.is_active='Y' AND d.is_delete='N' AND p.is_active='Y' AND upm.user_id=${db.escape(userId)} AND upm.can_view='Y'`
        }
        db.query(sql, (err, downloadCountDetails) => {
            if(err) {
                next(err)
            }
            else {
                res.json({status: "success", message: "Download Count Details", data: downloadCountDetails})
            }
        })
    },

    getContributorCount: (req, res, next) => {
        if("Y" === global.user_info[0].is_admin) {
            const sql = `
                SELECT COUNT(DISTINCT upm.user_id) AS total_contributors
                FROM tbl_user_project_mapping AS upm
                INNER JOIN tbl_users AS u ON upm.user_id = u.id
                INNER JOIN tbl_projects AS p ON upm.project_id = p.id
                WHERE 
                    u.is_active = 'Y' AND u.is_delete = 'N'
                    AND p.is_active = 'Y'
                    AND (upm.can_add = 'Y' OR upm.can_edit = 'Y')`

            db.query(sql, (err, contributorCountDetails) => {
                if(err) {
                    next(err)
                }
                else {
                    res.json({status: "success", message: "Contributor Count Details", data: contributorCountDetails})
                }
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    },

    getViewerCount: (req, res, next) => {
        if("Y" === global.user_info[0].is_admin) {
            const sql = `
                SELECT COUNT(DISTINCT upm.user_id) AS total_viewers
                FROM tbl_user_project_mapping AS upm
                INNER JOIN tbl_users AS u ON upm.user_id = u.id
                INNER JOIN tbl_projects AS p ON upm.project_id = p.id
                WHERE 
                u.is_active = 'Y' AND u.is_delete = 'N'
                AND p.is_active = 'Y'
                AND (upm.can_view = 'Y' OR upm.can_download = 'Y' OR upm.can_view_download_logsheet = 'Y')
                AND NOT (upm.can_add = 'Y' OR upm.can_edit = 'Y')`

            db.query(sql, (err, viewerCountDetails) => {
                res.json({status: "success", message: "Viewer Count Details", data: viewerCountDetails})
            })
        }
        else {
            res.json({status: "error", message: "Permission denied"})
        }
    }
}