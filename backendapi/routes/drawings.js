const express   = require("express")
const router    = express.Router()

const drawingController = require("../app/api/controllers/drawings")

router.get("/getdrawinglist", drawingController.getAll)
router.post("/createdrawing", drawingController.create)
router.put("/updatedrawing/:drawing_id", drawingController.update)
router.get("/updatedrawingstatus/:drawing_id", drawingController.changeStatus)
router.get("/deletedrawing/:drawing_id", drawingController.delete)
router.post("/downloaddrawing", drawingController.download)

module.exports = router