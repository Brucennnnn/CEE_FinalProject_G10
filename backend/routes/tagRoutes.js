const express = require("express")
const tagController = require("../controller/tagController")

const router = express.Router()
router.post("/addTag", tagController.addTag)
router.get("/getTags", tagController.getTags)
router.delete("/deleteTag", tagController.deleteTag)

module.exports = router