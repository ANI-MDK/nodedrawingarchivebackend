const express   = require("express")
const router    = express.Router()

const dashboardController = require("../app/api/controllers/dashboard")

router.get("/gettotaluploadedfile", dashboardController.getFileCount)
router.get("/gettotalproject", dashboardController.getProjectCount)
router.get("/gettotaldownload", dashboardController.getDownloadCount)
router.get("/gettotalcontributor", dashboardController.getContributorCount)
router.get("/gettotalviewer", dashboardController.getViewerCount)

module.exports = router