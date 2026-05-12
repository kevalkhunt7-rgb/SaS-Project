const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: String,
        enum: ["Free", "Pro", "Enterprise"],
        default: "Free"
    },
    status: {
        type: String,
        enum: ["active", "inactive", "expired", "cancelled"],
        default: "active"
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    limits: {
        maxBusinesses: { type: Number, default: 1 },
        maxKnowledgeEntries: { type: Number, default: 10 },
        maxChatsPerMonth: { type: Number, default: 100 },
        maxAiRepliesPerMonth: { type: Number, default: 50 },
        maxTeamMembers: { type: Number, default: 1 }
    },
    usage: {
        businessesUsed: { type: Number, default: 0 },
        knowledgeEntriesUsed: { type: Number, default: 0 },
        chatsUsedThisMonth: { type: Number, default: 0 },
        aiRepliesUsedThisMonth: { type: Number, default: 0 },
        teamMembersUsed: { type: Number, default: 0 }
    },
    lastUsageResetDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
