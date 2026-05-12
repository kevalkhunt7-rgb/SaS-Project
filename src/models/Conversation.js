const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  customerName: {
    type: String,
    default: "Guest"
  },
  customerEmail: {
    type: String
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active"
  },
  lastMessage: {
    type: String
  },
  lastMessageTime: {
    type: Date
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  pendingTicketOffer: {
    type: Boolean,
    default: false
  },
  lastQuestion: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
