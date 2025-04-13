const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Route to verify email before signing up
router.post("/verify-email", UserController.verifyEmail);

module.exports = router;
