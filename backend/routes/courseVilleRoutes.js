const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();
router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);
router.get("/me", coursevilleController.getUserInfo);
router.get("/allAssignments/:semester/:year", coursevilleController.getAllAssignments);
router.get("/courses/:semester/:year", coursevilleController.getCourse);
router.get("/assignment/:id", coursevilleController.getAssignments);
router.get("/recentyns", coursevilleController.getSemesterAndYear);
module.exports = router;