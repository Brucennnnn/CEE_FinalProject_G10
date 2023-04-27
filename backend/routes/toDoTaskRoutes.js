const express = require("express");
const taskController = require("../controller/taskController");

const router = express.Router();
router.post("/addTask", taskController.addTask);
router.get("/getTasks", taskController.getTasks);
router.get("/getTasksWithTags", taskController.getTaskByTags);
router.get("/getTasksByDueDate", taskController.getTasksByDueDate);
router.get("/getTasksByStatus/:status", taskController.getTasksByStatus);
router.delete("/deleteTask",taskController.deleteTask);
router.post("/updateTask",taskController.updateTask);

module.exports = router;