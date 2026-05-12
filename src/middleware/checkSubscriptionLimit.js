const Subscription = require("../models/Subscription");
const plans = require("../config/plans");

const checkSubscriptionLimit = (limitType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id || req.user.id;
            let subscription = await Subscription.findOne({ user: userId });

            // Auto-create Free subscription if not exists
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

            // Check if monthly usage needs reset
            const now = new Date();
            const lastReset = new Date(subscription.lastUsageResetDate);
            if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
                subscription.usage.chatsUsedThisMonth = 0;
                subscription.usage.aiRepliesUsedThisMonth = 0;
                subscription.lastUsageResetDate = now;
                await subscription.save();
            }

            const limit = subscription.limits[limitType];
            const usage = subscription.usage[limitType.replace('max', '').toLowerCase() + 'sUsed'] || 
                          subscription.usage[limitType.replace('max', '').charAt(0).toLowerCase() + limitType.replace('max', '').slice(1).replace('PerMonth', '') + 'UsedThisMonth'];

            if (limit !== -1 && usage >= limit) {
                return res.status(403).json({
                    success: false,
                    upgradeRequired: true,
                    message: `Your ${subscription.plan} plan limit for ${limitType.replace('max', '')} is reached. Please upgrade to continue.`,
                    currentPlan: subscription.plan,
                    limitType: limitType.replace('max', '')
                });
            }

            req.subscription = subscription;
            next();
        } catch (error) {
            console.error("Subscription limit check error:", error);
            res.status(500).json({ success: false, message: "Error checking subscription limits" });
        }
    };
};

module.exports = checkSubscriptionLimit;
