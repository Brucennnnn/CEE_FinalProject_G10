const express = require("express");
const taskController = require("../controller/taskController");

const router = express.Router();
router.post("/addTask", taskController.addTask);
router.post("/getTasks", taskController.getTasks);

module.exports = router;