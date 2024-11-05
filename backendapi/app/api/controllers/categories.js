const db = require("../../../config/db")

fetchCategories = (res, next) => {
    db.query(
        "SELECT id AS category_id, name AS category_name FROM tbl_categories WHERE is_active = 'Y' ORDER BY id ASC",
        (err, categoryList) => {
            if (err) {
                return next(err)
            }
            else {
                res.json({status: "success", message: "Category list", data: categoryList})
            }
        }
    )
}

fetchSubCategories = (res, next) => {
    db.query(
        "SELECT id AS sub_category_id, name AS sub_category_name FROM tbl_sub_categories WHERE is_active='Y' ORDER BY id ASC",
        (err, subCategoryList) => {
            if (err) {
                return next(err)
            }
            else {
                res.json({status: "success", message: "Sub category list", data: subCategoryList})
            }
        }
    )
}

module.exports = {
    getAll: (req, res, next) => {
        if("Y" === global.user_info[0].is_admin) {
            fetchCategories(res, next)
        }
        else {
            const pageName = req.params.page_name.trim()
            if("add" === pageName || "edit" === pageName) {
                const projectId = req.params.project_id
                const userId = global.user_info[0].id
                let sql = ""
                switch (pageName) {
                    case "add":
                        sql = `
                            SELECT COUNT(CASE WHEN m.can_add = 'Y' THEN 1 END) AS has_permission 
                            FROM tbl_projects p 
                            INNER JOIN tbl_user_project_mapping m 
                            ON p.id = m.project_id 
                            WHERE m.user_id = ${db.escape(userId)} 
                            AND p.is_active = 'Y'
                        `
                        break
    
                    case "edit":
                        sql = `
                            SELECT COUNT(*) AS has_permission 
                            FROM tbl_projects p 
                            JOIN tbl_user_project_mapping upm 
                            ON p.id = upm.project_id 
                            WHERE upm.user_id = ${db.escape(userId)} 
                            AND upm.project_id = ${db.escape(projectId)} 
                            AND upm.can_edit = 'Y' 
                            AND p.is_active = 'Y'
                        `
                        break
                }
                db.query(sql, (err, permissionInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(permissionInfo[0].has_permission) {
                        fetchCategories(res, next)
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
    },

    getAllSub: (req, res, next) => {
        if("Y" === global.user_info[0].is_admin) {
            fetchSubCategories(res, next)
        }
        else {
            const pageName = req.params.page_name.trim()
            if("add" === pageName || "edit" === pageName) {
                const projectId = req.params.project_id
                const userId = global.user_info[0].id
                let sql = ""
                switch (pageName) {
                    case "add":
                        sql = `
                            SELECT COUNT(CASE WHEN m.can_add = 'Y' THEN 1 END) AS has_permission 
                            FROM tbl_projects p 
                            INNER JOIN tbl_user_project_mapping m 
                            ON p.id = m.project_id 
                            WHERE m.user_id = ${db.escape(userId)} 
                            AND p.is_active = 'Y'
                        `
                        break
    
                    case "edit":
                        sql = `
                            SELECT COUNT(*) AS has_permission 
                            FROM tbl_projects p 
                            JOIN tbl_user_project_mapping upm 
                            ON p.id = upm.project_id 
                            WHERE upm.user_id = ${db.escape(userId)} 
                            AND upm.project_id = ${db.escape(projectId)} 
                            AND upm.can_edit = 'Y' 
                            AND p.is_active = 'Y'
                        `
                        break
                }
                db.query(sql, (err, permissionInfo) => {
                    if(err) {
                        next(err)
                    }
                    else if(permissionInfo[0].has_permission) {
                        fetchSubCategories(res, next)
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