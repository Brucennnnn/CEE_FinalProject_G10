const express = require("express");
const taskController = require("../controller/taskController");
const { middleware } = require("./middleware");

const router = express.Router();
router.post("/addTask", taskController.addTask);
router.get("/getTasks", taskController.getTasks);
router.delete("/deleteTask",taskController.deleteTask);

module.exports = router;