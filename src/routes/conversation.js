const express = require("express");
const {
  startConversation,
  getBusinessConversations,
  getConversationById,
  closeConversation,
  deleteConversation
} = require("../controllers/conversationController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/start", startConversation);
router.get("/business", authMiddleware, getBusinessConversations);
router.get("/:id", authMiddleware, getConversationById);
router.put("/close/:id", authMiddleware, closeConversation);
router.delete("/delete/:id", authMiddleware, deleteConversation);

module.exports = router;
