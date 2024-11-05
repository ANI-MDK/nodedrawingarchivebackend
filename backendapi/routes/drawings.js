const express   = require("express")
const router    = express.Router()

const drawingController = require("../app/api/controllers/drawings")

router.get("/getdrawinglist", drawingController.getAll)
router.post("/createdrawing", drawingController.create)
router.get("/updatedrawingstatus/:drawing_id", drawingController.changeStatus)
router.get("/deletedrawing/:drawing_id", drawingController.delete)

module.exports = router