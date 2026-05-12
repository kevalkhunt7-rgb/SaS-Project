const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema({

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  category: {
    type: String,
    default: "general"
  },

  keywords: [
    {
      type: String
    }
  ],

  sourceType: {
    type: String,
    enum: [
      "manual",
      "website",
      "pdf",
      "faq",
      "document"
    ],
    default: "manual"
  },

  sourceUrl: {
    type: String
  },

  fileUrl: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  },

  trained: {
    type: Boolean,
    default: false
  },

  lastTrainedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Knowledge", knowledgeSchema);