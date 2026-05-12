const express = require("express");
const { startChat , customerMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start/:businessId", authMiddleware, startChat);
router.post("/customer-message/:businessId", authMiddleware, customerMessage);

module.exports = router;