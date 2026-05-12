const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ["customer", "ai", "agent"],
    required: true
  },
  isAiResponse: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
