const express   = require("express")
const router    = express.Router()

const roleController = require("../app/api/controllers/roles")

router.get("/getrolelist", roleController.getAll)
router.post("/createrole", roleController.create)
router.put("/updaterole/:role_id", roleController.update)

module.exports = router