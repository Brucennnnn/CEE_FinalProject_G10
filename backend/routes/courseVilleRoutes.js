const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();
router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);
router.get("/me", coursevilleController.getUserInfo);
router.get("/getAllAssignments/:semester/:year", coursevilleController.getAllAssignments);

module.exports = router;