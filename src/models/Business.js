const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    industry: {
        type: String,
        default: "General"
    },
    description: {
        type: String,
        default: ""
    },
    supportEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    logo: {
        url: {
            type: String,
            default: "",
        },

        public_id: {
            type: String,
            default: "",
        },
    },
    brandColor: {
        type: String,
        default: "#2563eb"
    },
    plan: {
        type: String,
        enum: ["Free", "Pro", "Enterprise"],
        default: "Free"
    },
    aiSettings: {
        aiEnabled: {
            type: Boolean,
            default: true
        },
         aiModel: {
        type: String,
        default: "gpt-4o-mini"
    },
    },

    widgetSettings: {
        title: {
            type: String,
            default: "SupportAI Assistant"
        },
        color: {
            type: String,
            default: "#2563eb"
        },

        widgetPosition: {
            type: String,
            enum: ["bottom-right", "bottom-left", "top-right", "top-left"],
            default: "bottom-right"
        },
        widgetEnabled: {
            type: Boolean,
            default: true
        },
        welcomeMessage: {
            type: String,
            default: "Hi! How can I help you today?"
        },
        widgetAvatar: {
            type: String,
            default: "bot"
        },
    },
    monthlyChatLimit: {
        type: Number,
        default: 1000
    },
    isActive: {
        type: Boolean,
        default: true
    },
    TotalConversations: {
        type: Number,
        default: 0
    },
    totalTickets: {
        type: Number,
        default: 0
    },
},
    { timestamps: true }

);

module.exports = mongoose.model("Business", businessSchema)