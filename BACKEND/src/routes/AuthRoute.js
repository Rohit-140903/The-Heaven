const express = require("express");
const { signup, login,updatePassword,verifyEmailSignup,verifyEmail,clientDetails,adminLogin,adminSignup } = require("../controllers/AuthController");
const fetchUser = require("../middleware/AuthMiddleware")
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/Adminsignup", adminSignup);
router.post("/Adminlogin", adminLogin);
router.post("/update-password", updatePassword);
router.post("/verify-email", verifyEmail);
router.post("/verify-email-signup", verifyEmailSignup);
router.post("/clientDetails" , fetchUser, clientDetails);

module.exports = router;
