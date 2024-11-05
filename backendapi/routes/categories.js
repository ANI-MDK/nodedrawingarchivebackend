const express   = require("express")
const router    = express.Router()

const categoryController = require("../app/api/controllers/categories")

router.get("/getcategory/:page_name?/:project_id?", categoryController.getAll)
router.get("/getsubcategory/:page_name?/:project_id?", categoryController.getAllSub)

module.exports = router