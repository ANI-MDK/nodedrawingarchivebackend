const express   = require("express")
const router    = express.Router()

const reportController = require("../app/api/controllers/reports")

router.get("/getdownloadlist", reportController.getAllDownloadLog)

module.exports = router