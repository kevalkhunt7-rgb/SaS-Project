const express = require("express");
const {
  getDashboardStats,
  getDashboardCharts
} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/charts", authMiddleware, getDashboardCharts);

module.exports = router;
