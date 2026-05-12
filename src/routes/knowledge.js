const express = require("express");
const {
  createKnowledgeBase,
  getMyKnowledgeBase,
  getKnowledgeById,
  updateKnowledge,
  deleteKnowledge,
  searchKnowledge,
  uploadFileKnowledge,
  scrapeWebsiteKnowledge,
  trainAI,
  getKnowledgeCategories,
  toggleKnowledgeStatus,
  publicKnowledgeSearch
} = require("../controllers/knowledgeBaseController");
const authMiddleware = require("../middleware/authMiddleware");
const checkSubscriptionLimit = require("../middleware/checkSubscriptionLimit");
const uploadDocument = require("../middleware/multerDocument");
const router = express.Router();

router.get("/my", authMiddleware, getMyKnowledgeBase);
router.get("/search", authMiddleware, searchKnowledge);
router.get("/categories", authMiddleware, getKnowledgeCategories);
router.get("/:id", authMiddleware, getKnowledgeById);

router.post("/create", authMiddleware, checkSubscriptionLimit("maxKnowledgeEntries"), createKnowledgeBase);
router.post("/upload", authMiddleware, checkSubscriptionLimit("maxKnowledgeEntries"), uploadDocument.single("file"), uploadFileKnowledge);
router.post("/scrape-website", authMiddleware, checkSubscriptionLimit("maxKnowledgeEntries"), scrapeWebsiteKnowledge);
router.post("/train-ai", authMiddleware, trainAI);

router.put("/update/:id", authMiddleware, updateKnowledge);
router.put("/toggle-status/:id", authMiddleware, toggleKnowledgeStatus);

router.delete("/delete/:id", authMiddleware, deleteKnowledge);

module.exports = router;
