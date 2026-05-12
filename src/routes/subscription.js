const express = require("express");
const { 
    createOrder, 
    verifyPayment, 
    getCurrentSubscription, 
    getPlans 
} = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/plans", getPlans);

router.use(authMiddleware);

router.get("/current", getCurrentSubscription);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
