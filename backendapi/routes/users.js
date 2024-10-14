const express   = require("express")
const router    = express.Router()

const userController = require("../app/api/controllers/users")

router.get("/getuserlist", userController.getAll)
router.post("/createuser", userController.create)
router.put("/updateuser/:user_id", userController.update)
router.put("/updateuserpassword/:user_id", userController.updatePassword)

module.exports = router