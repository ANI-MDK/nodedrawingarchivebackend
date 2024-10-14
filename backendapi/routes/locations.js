const express   = require("express")
const router    = express.Router()

const locationController = require("../app/api/controllers/locations")

router.get("/getlocationlist", locationController.getAll)
router.post("/createlocation", locationController.create)
router.put("/updatelocation/:location_id", locationController.update)

module.exports = router