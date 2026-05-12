const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/Subscription");
const plans = require("../config/plans");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    try {
        const { planName } = req.body;
        if (!plans[planName] || planName === "Free") {
            return res.status(400).json({ success: false, message: "Invalid plan selected" });
        }

        const amount = plans[planName].price * 100; // Razorpay expects amount in paise
        const options = {
            amount,
            currency: "INR",
            receipt: `receipt_plan_${planName}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Razorpay create order error:", error);
        res.status(500).json({ success: false, message: "Error creating Razorpay order" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body;
        const userId = req.user._id || req.user.id;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        let subscription = await Subscription.findOne({ user: userId });
        if (!subscription) {
            subscription = new Subscription({ user: userId });
        }

        subscription.plan = planName;
        subscription.status = "active";
        subscription.startDate = new Date();
        subscription.endDate = endDate;
        subscription.razorpayOrderId = razorpay_order_id;
        subscription.razorpayPaymentId = razorpay_payment_id;
        subscription.razorpaySignature = razorpay_signature;
        subscription.limits = plans[planName];

        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and subscription updated successfully",
            subscription
        });
    } catch (error) {
        console.error("Razorpay verify payment error:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};

const getCurrentSubscription = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        let subscription = await Subscription.findOne({ user: userId });

        if (!subscription) {
            subscription = await Subscription.create({
                user: userId,
                plan: "Free",
                limits: plans.Free,
                usage: {
                    businessesUsed: 0,
                    knowledgeEntriesUsed: 0,
                    chatsUsedThisMonth: 0,
                    aiRepliesUsedThisMonth: 0,
                    teamMembersUsed: 0
                }
            });
        }

        res.status(200).json({
            success: true,
            subscription
        });
    } catch (error) {
        console.error("Get subscription error:", error);
        res.status(500).json({ success: false, message: "Error fetching subscription" });
    }
};

const getPlans = (req, res) => {
    res.status(200).json({
        success: true,
        plans
    });
};

module.exports = {
    createOrder,
    verifyPayment,
    getCurrentSubscription,
    getPlans
};
