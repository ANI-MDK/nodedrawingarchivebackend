const db = require("../../../config/db")

module.exports = {
    getAllDownloadLog: (req, res, next) => {
        let sql = ""
        if("Y" === global.user_info[0].is_admin) {
            sql = `SELECT u.name AS user_name, p.code AS project_code, d.drg_number AS drawing_number, d.description AS drawing_description, l.download_reason AS download_reason, l.download_on AS download_on 
            FROM tbl_download_logsheet l 
            JOIN tbl_users u ON l.user_id=u.id 
            JOIN tbl_drawings d ON l.drawing_id=d.id 
            JOIN tbl_projects p ON d.project_id=p.id 
            ORDER BY l.download_on DESC`
        }
        else {
            const userId = global.user_info[0].id
            sql = `SELECT u.name AS user_name, p.code AS project_code, d.drg_number AS drawing_number, d.description AS drawing_description, l.download_reason AS download_reason, l.download_on AS download_on 
            FROM tbl_download_logsheet l 
            JOIN tbl_users u ON l.user_id=u.id 
            JOIN tbl_drawings d ON l.drawing_id=d.id 
            JOIN tbl_projects p ON d.project_id=p.id 
            JOIN tbl_user_project_mapping upm ON p.id=upm.project_id 
            WHERE upm.user_id=${db.escape(userId)} AND upm.can_view_download_logsheet='Y' 
            GROUP BY u.name, p.code, d.drg_number, d.description, l.download_reason, l.download_on 
            ORDER BY l.download_on DESC`
        }
        db.query(sql, (err, drawingDownloadList) => {
            if(err) {
                next(err)
            }
            else {
                // console.log(drawingDownloadList)
                res.json({status: "success", message: "Drawing download list", data: drawingDownloadList})
            }
        })
    }
}