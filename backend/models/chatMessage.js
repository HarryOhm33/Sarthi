const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Victim",
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ["victim", "bot"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
