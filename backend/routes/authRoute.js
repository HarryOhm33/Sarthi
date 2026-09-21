const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  login,
  logout,
  verifySession,
  forgotPassword,
  resetPassword,
  forgotPasswordMobile,
} = require("../controllers/auth");

// ✅ User Login
router.post("/login", wrapAsync(login));

router.post("/logout", authenticate, wrapAsync(logout));

router.post("/forgot-password", wrapAsync(forgotPassword));
router.post("/forgot-password-mobile", wrapAsync(forgotPasswordMobile));

router.post("/reset-password", wrapAsync(resetPassword));

// ✅ Protected Route Example
router.post("/verify-session", authenticate, wrapAsync(verifySession));

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({ valid: true, message: "Welcome!", victim: req.victim });
});

module.exports = router;
