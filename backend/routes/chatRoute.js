const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  getHistory,
  sendMessage,
  clearHistory,
} = require("../controllers/chat");

// All chat endpoints require victim authentication
router.get("/history", authenticate, wrapAsync(getHistory));
router.post("/send", authenticate, wrapAsync(sendMessage));
router.delete("/history", authenticate, wrapAsync(clearHistory));

module.exports = router;
