const mongoose = require("mongoose");

const adminSessionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3600 * 1000 * 24 * 7), // 7 days
    index: { expires: "7d" },
  },
});

const AdminSession = mongoose.model("AdminSession", adminSessionSchema);

module.exports = AdminSession;
