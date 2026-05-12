const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { generateAIReply, generateBusinessAssistantReply } = require("../controllers/aiController");

router.post("/reply", generateAIReply);
router.post("/business-assistant", authMiddleware, generateBusinessAssistantReply);

module.exports = router;