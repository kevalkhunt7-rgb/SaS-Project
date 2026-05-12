const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const { publicKnowledgeSearch } = require("./controllers/knowledgeBaseController")
const Business = require("./models/Business")
const Conversation = require("./models/Conversation")
const Message = require("./models/Message")


dotenv.config()
connectDB();
const app  = express()
const cors = require("cors");
const PORT = process.env.PORT ;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());

// Temporary middleware to ensure a demo business exists for the ChatWidget
app.use(async (req, res, next) => {
  try {
    const demoSlug = "demo-business";
    const User = require("./models/User");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@supportai.com";
    
    // Ensure admin user exists
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      adminUser = await User.create({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      console.log(`System admin created: ${adminEmail}`);
    }

    const demoBusiness = await Business.findOne({ slug: demoSlug });
    if (!demoBusiness) {
      const owner = adminUser;
      
      if (owner) {
        const business = await Business.create({
          businessName: "SupportAI Demo",
          slug: demoSlug,
          owner: owner._id,
          supportEmail: owner.email, // Required field
          brandColor: "#2563eb",
          description: "This is a demo business to showcase SupportAI capabilities."
        });
        console.log("Demo business created successfully");

        // Seed demo knowledge
        const Knowledge = require("./models/KnowledgeBase");
        await Knowledge.create([
          {
            business: business._id,
            title: "About SupportAI",
            content: "SupportAI is an all-in-one AI customer support platform. It allows businesses to train custom AI models on their own data, manage conversations, and handle support tickets efficiently.",
            category: "General"
          },
          {
            business: business._id,
            title: "Pricing Plans",
            content: "SupportAI offers a Free plan with 1,000 monthly messages and a Pro plan with unlimited messages, custom branding, and advanced analytics for $49/month.",
            category: "Pricing"
          },
          {
            business: business._id,
            title: "How to setup",
            content: "To setup SupportAI, create an account, go to your profile to create a business, and then upload your documents to the Knowledge Base. Finally, embed the chat widget on your website.",
            category: "Setup"
          }
        ]);
        console.log("Demo knowledge seeded");
      }
    }
    next();
  } catch (error) {
    console.error("Error ensuring demo business:", error);
    next();
  }
});

app.get("/",(req,res)=>{
    res.send("API is Running")
})

app.use("/auth",require('./routes/user.js'))
app.use("/business",require('./routes/business.js'))
app.use("/chat",require('./routes/chat.js'))
app.use("/knowledge",require('./routes/knowledge.js'))
app.use("/conversation",require('./routes/conversation.js'))
app.use("/message",require('./routes/message.js'))
app.use("/ai",require('./routes/ai.js'))
app.use("/ticket",require('./routes/ticket.js'))
app.use("/dashboard",require('./routes/dashboard.js'))
app.use("/subscription",require('./routes/subscription.js'))
app.use("/admin", require('./routes/admin.js'))

app.post("/public/knowledge/search", publicKnowledgeSearch)

app.get("/public/business/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    let business = await Business.findOne({ slug }).select(
      "businessName logo widgetSettings brandColor"
    );

    // Fallback for demo
    if (!business && slug === "demo-business") {
      business = await Business.findOne().select("businessName logo widgetSettings brandColor");
    }

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching business", error: error.message });
  }
});

app.get("/public/business/id/:businessId", async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const business = await Business.findById(businessId).select(
      "businessName logo widgetSettings brandColor"
    );

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching business", error: error.message });
  }
});

const Subscription = require("./models/Subscription");
const plans = require("./config/plans");

app.post("/public/chat/start", async (req, res) => {
  try {
    const { businessSlug, businessId, customerName, customerEmail } = req.body;
    let business;
    
    if (businessId) {
      business = await Business.findById(businessId);
    } else if (businessSlug) {
      business = await Business.findOne({ slug: businessSlug });
      // Fallback: If demo-business not found, use the first business available
      if (!business && businessSlug === "demo-business") {
        business = await Business.findOne();
      }
    }

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    // Check Subscription Limit for Chats
    const subscription = await Subscription.findOne({ user: business.owner });
    if (subscription) {
        // Reset monthly usage if needed
        const now = new Date();
        const lastReset = new Date(subscription.lastUsageResetDate);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            subscription.usage.chatsUsedThisMonth = 0;
            subscription.usage.aiRepliesUsedThisMonth = 0;
            subscription.lastUsageResetDate = now;
        }

        if (subscription.limits.maxChatsPerMonth !== -1 && subscription.usage.chatsUsedThisMonth >= subscription.limits.maxChatsPerMonth) {
            return res.status(403).json({
                success: false,
                upgradeRequired: true,
                message: `The ${subscription.plan} plan limit for chats is reached for this business.`,
                currentPlan: subscription.plan,
                limitType: "chats"
            });
        }

        subscription.usage.chatsUsedThisMonth += 1;
        await subscription.save();
    }

    const conversation = new Conversation({
      business: business._id,
      customerName: customerName || "Guest",
      customerEmail,
      lastMessage: business.widgetSettings?.welcomeMessage || "Hi! How can I help you today?",
      lastMessageTime: new Date()
    });
    await conversation.save();
    
    const welcomeMessage = new Message({
      conversation: conversation._id,
      business: business._id,
      message: business.widgetSettings?.welcomeMessage || "Hi! How can I help you today?",
      sender: "ai",
      isAiResponse: true
    });
    await welcomeMessage.save();
    
    res.status(201).json({ success: true, conversation, welcomeMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error starting chat", error: error.message });
  }
});

app.post("/public/chat/message", async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    
    const newMessage = new Message({
      conversation: conversationId,
      business: conversation.business,
      message,
      sender: "customer",
      isAiResponse: false
    });
    await newMessage.save();
    
    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();
    conversation.totalMessages += 1;
    await conversation.save();
    
    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending message", error: error.message });
  }
});


app.listen(PORT,()=>{
    console.log("Server Runing on",PORT)
})