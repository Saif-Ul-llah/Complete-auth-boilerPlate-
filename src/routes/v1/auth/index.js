const express = require("express");
const {
  SignUp,
  verifyOtp,
  login,
  forgotPassword,
  ResetPassword,
} = require("../../../controllers/auth");
const router = express.Router();

const { protect } = require("../../../middlewares/authMiddleware");

// Register a new user route
router.post("/signUp", SignUp);
// Verify OTP route
router.post("/verifyOtp", verifyOtp);
// Login route
router.post("/signIn", login);
//Forgot Password
router.post("/forgotPassword", forgotPassword);
//Reset Password
router.post("/resetPassword",protect, ResetPassword);

module.exports = router;
