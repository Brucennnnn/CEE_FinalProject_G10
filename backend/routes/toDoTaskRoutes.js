const express = require("express");
const taskController = require("../controller/taskController");

const router = express.Router();
router.post("/addTask", taskController.addTask);
router.get("/getTasks", taskController.getTasks);
router.delete("/deleteTask",taskController.deleteTask);
router.post("/updateTask",taskController.updateTask);

module.exports = router;