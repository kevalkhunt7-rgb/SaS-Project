const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const { createBusiness , MyBusiness, updateBusiness , deleteBusiness , getWidgetSettings , updateWidgetSettings , getAiSettings , updateAiSettings , businessDashboard ,getBusinessAnalytics ,getCurrentPlan , upgradePlan ,getBusinessDetails } = require('../controllers/businessController');
const checkSubscriptionLimit = require('../middleware/checkSubscriptionLimit');
const router = express.Router();

router.post("/create",authMiddleware,checkSubscriptionLimit("maxBusinesses"),createBusiness);
router.get("/my-business",authMiddleware,MyBusiness);
router.patch("/update",authMiddleware,upload.single("logo"),updateBusiness);
router.delete("/delete",authMiddleware,deleteBusiness);
router.get("/widget-settings",authMiddleware,getWidgetSettings);
router.patch("/widget-settings",authMiddleware,updateWidgetSettings);
router.get("/ai-settings",authMiddleware,getAiSettings);
router.patch("/ai-settings",authMiddleware,updateAiSettings);
router.get("/dashboard",authMiddleware,businessDashboard);
router.get("/analytics",authMiddleware,getBusinessAnalytics);
router.get("/current-plan",authMiddleware,getCurrentPlan);
router.patch("/upgrade-plan",authMiddleware,upgradePlan);

router.get("/details",authMiddleware,getBusinessDetails);
module.exports = router;