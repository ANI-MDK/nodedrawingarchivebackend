const express   = require("express")
const router    = express.Router()

const categoryController = require("../app/api/controllers/categories")

router.get("/getcategorylist", categoryController.getAll)
router.post("/createcategory", categoryController.create)
router.put("/updatecategory/:category_id", categoryController.update)

module.exports = router