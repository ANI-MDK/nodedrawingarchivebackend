const express   = require("express")
const router    = express.Router()

const projectController = require("../app/api/controllers/projects")

router.get("/getprojectlist", projectController.getAll)
router.post("/createproject", projectController.create)
router.put("/updateproject/:project_id", projectController.update)

module.exports = router