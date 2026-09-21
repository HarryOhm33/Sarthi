const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  victimId: { type: mongoose.Schema.Types.ObjectId, ref: "Victim", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3600 * 1000 * 24 * 7),
  }, // Auto-expire after 7 days
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
