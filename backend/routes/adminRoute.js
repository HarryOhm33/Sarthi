const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const adminAuthenticate = require("../middleware/adminAuthenticate");
const {
  adminLogin,
  adminVerifySession,
  adminLogout,
  getDashboardStats,
  getAnalyticsFeed,
  getVictimDirectory,
  triggerManualAnalytics,
  regenerateVictimAnalytics,
} = require("../controllers/adminAuth");

// Authentication Routes
router.post("/login", wrapAsync(adminLogin));
router.get("/verify", adminAuthenticate, wrapAsync(adminVerifySession));
router.post("/verify", adminAuthenticate, wrapAsync(adminVerifySession));
router.get("/verify-session", adminAuthenticate, wrapAsync(adminVerifySession));
router.post("/verify-session", adminAuthenticate, wrapAsync(adminVerifySession));
router.post("/logout", adminAuthenticate, wrapAsync(adminLogout));

// Dashboard Data Routes (Protected)
router.get("/stats", adminAuthenticate, wrapAsync(getDashboardStats));
router.get("/analytics", adminAuthenticate, wrapAsync(getAnalyticsFeed));
router.get("/victims", adminAuthenticate, wrapAsync(getVictimDirectory));
router.post("/trigger-analytics", adminAuthenticate, wrapAsync(triggerManualAnalytics));
router.post("/victim/:victimId/regenerate-analytics", adminAuthenticate, wrapAsync(regenerateVictimAnalytics));

module.exports = router;
