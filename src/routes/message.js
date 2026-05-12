const express = require("express");
const {
  sendMessage,
  getMessagesByConversationId
} = require("../controllers/messageController");
const { generateAIReply } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/send", sendMessage);
router.get("/:conversationId", getMessagesByConversationId);
router.post("/ai/reply", generateAIReply);

module.exports = router;
