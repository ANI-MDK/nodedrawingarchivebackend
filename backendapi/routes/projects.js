const express   = require("express")
const router    = express.Router()

const projectController = require("../app/api/controllers/projects")

router.get("/getprojectlist", projectController.getAll)
router.post("/createproject", projectController.create)
router.put("/updateproject/:project_id", projectController.update)
router.get("/updateprojectstatus/:project_id", projectController.changeStatus)
router.get("/getactiveprojectlist/:page_name", projectController.getAllActiveProjectUserWise)

module.exports = router