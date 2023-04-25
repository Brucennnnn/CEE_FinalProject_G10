const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();
router.get("/auth_app", coursevilleController.authApp);
router.get("/access_token", coursevilleController.accessToken);
router.get("/me", coursevilleController.getUserInfo);
router.get("/assignment/:semester/:year", coursevilleController.getAllAssignment);
router.get("/getcourse/:semester/:year", coursevilleController.getCourse);

module.exports = router;