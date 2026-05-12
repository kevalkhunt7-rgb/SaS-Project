const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Knowledge = require("../models/KnowledgeBase");
const Business = require("../models/Business");
const Ticket = require("../models/Ticket");
const openai = require("../config/openai");

const Subscription = require("../models/Subscription");

const generateAIReply = async (req, res) => {
  try {
    const { conversationId, customerQuestion } = req.body;

    if (!conversationId || !customerQuestion) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and customer question are required"
      });
    }

    const conversation = await Conversation.findById(conversationId).populate("business");
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Check Subscription Limit for AI Replies
    const subscription = await Subscription.findOne({ user: conversation.business.owner });
    if (subscription) {
        // Reset monthly usage if needed
        const now = new Date();
        const lastReset = new Date(subscription.lastUsageResetDate);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            subscription.usage.chatsUsedThisMonth = 0;
            subscription.usage.aiRepliesUsedThisMonth = 0;
            subscription.lastUsageResetDate = now;
        }

        if (subscription.limits.maxAiRepliesPerMonth !== -1 && subscription.usage.aiRepliesUsedThisMonth >= subscription.limits.maxAiRepliesPerMonth) {
            return res.status(403).json({
                success: false,
                upgradeRequired: true,
                message: "AI reply limit reached for this business's current plan.",
                currentPlan: subscription.plan,
                limitType: "aiReplies"
            });
        }

        subscription.usage.aiRepliesUsedThisMonth += 1;
        await subscription.save();
    }

    // 0. Check if we are waiting for a ticket confirmation
    const affirmativeResponses = ["yes", "sure", "ok", "yep", "do it", "please", "confirm", "yeah"];
    if (conversation.pendingTicketOffer && affirmativeResponses.some(res => customerQuestion.toLowerCase().includes(res))) {
      // Create a ticket
      const newTicket = new Ticket({
        business: conversation.business._id,
        customer: "guest",
        customerName: conversation.customerName || "Guest",
        customerEmail: conversation.customerEmail,
        subject: `Auto-generated from Chat: ${conversation.lastQuestion?.substring(0, 30)}...`,
        description: conversation.lastQuestion || "No description provided",
        priority: "Medium"
      });

      await newTicket.save();

      // Reset offer status
      conversation.pendingTicketOffer = false;
      conversation.lastQuestion = null;
      await conversation.save();

      const aiReply = "Perfect! I've created a support ticket for you. One of our agents will review your request and get back to you as soon as possible.";

      // Save AI reply
      const aiMessage = new Message({
        conversation: conversationId,
        business: conversation.business._id,
        message: aiReply,
        sender: "ai",
        isAiResponse: true
      });
      await aiMessage.save();

      return res.status(200).json({
        success: true,
        aiReply: aiReply,
        data: aiMessage
      });
    }

    // Reset pending offer if user said something else
    if (conversation.pendingTicketOffer) {
      conversation.pendingTicketOffer = false;
      await conversation.save();
    }

    const isLandingPageBot = conversation.business.slug === "demo-business";

    // 1. Find Business Knowledge
    // Improve search by looking for keywords and being more inclusive
    const cleanQuestion = customerQuestion.replace(/[^\w\s]/gi, ' ').trim();
    const keywords = cleanQuestion
      .split(/\s+/)
      .filter((word) => word.length >= 3); // Include words like "pay", "app"

    // Create a search pattern that matches any of the keywords
    const searchPattern = keywords.length > 0 ? keywords.join("|") : cleanQuestion;

    const relevantKnowledge = await Knowledge.find({
      business: conversation.business._id,
      isActive: true,
      $or: [
        { title: { $regex: searchPattern, $options: "i" } },
        { content: { $regex: searchPattern, $options: "i" } },
        { keywords: { $regex: searchPattern, $options: "i" } },
        // Also try matching the whole question in case it's a specific phrase
        { title: { $regex: cleanQuestion, $options: "i" } },
        { content: { $regex: cleanQuestion, $options: "i" } }
      ]
    }).limit(10); // Provide more context results

    // 2. Prepare Context and Send to OpenAI
    const context = relevantKnowledge
      .map((k) => `[Topic: ${k.title}]\n${k.content}`)
      .join("\n\n---\n\n");

    // 3. Get AI answer
    let aiReply = "";
    try {
      const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
      
      let systemPrompt = "";
      if (isLandingPageBot) {
        systemPrompt = `You are the official SupportAI Landing Page Assistant.
        
        GOAL:
        - Answer questions about SupportAI platform based on the provided knowledge.
        - Be friendly, professional, and concise.
        - If the user asks for services or how to use SupportAI for their own business:
          1. If they seem interested in creating their own bot, suggest they "Create a Business" from their dashboard.
          2. If they already have a business, tell them to go to their Dashboard to manage their AI.
        - For greetings (hi, hello), be warm and welcome them to SupportAI.
        - If you don't know something about SupportAI, politely say you're a demo bot and they can contact our support team.

        KNOWLEDGE BASE:
        ${context || "SupportAI is an AI-powered customer support platform that helps businesses automate their customer service."}`;
      } else {
        systemPrompt = `You are a helpful customer support AI assistant for ${conversation.business.businessName}. 
            
            GUIDELINES:
            1. Use the provided Business Knowledge to answer questions accurately and helpfully.
            2. ALWAYS prioritize the provided Business Knowledge. If the user's question relates to a topic in the knowledge base (like "online payment"), use that information even if the question has extra details (like "while booking appointment").
            3. If the provided knowledge says "user can pay online using any UPI app or Card", and the user asks "can i pay online while booking appointment?", you should answer "Yes, you can pay online using any UPI app or Card."
            4. If you absolutely cannot find any relevant information in the provided Business Knowledge:
               - Politely apologize to the customer.
               - Explicitly ask if they would like you to create a support ticket for them.
               - Keep the response short, professional, and helpful.
            5. Do NOT mention internal terms like "knowledge base", "context", or "training data". Speak naturally.
            6. Never make up or hallucinate information not supported by the provided knowledge.

            BUSINESS KNOWLEDGE:
            ${context || "No information available for this specific query."}`;
      }

      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: customerQuestion
          }
        ]
      });
      aiReply = response.choices[0].message.content;

      // If AI offered a ticket, mark it in the conversation
      if (aiReply.toLowerCase().includes("support ticket") && !isLandingPageBot) {
        conversation.pendingTicketOffer = true;
        conversation.lastQuestion = customerQuestion;
        await conversation.save();
      }
    } catch (apiError) {
      console.error("AI API Error:", apiError);
      
      // Fallback for Quota or API issues
      if (apiError.message && (apiError.message.includes("quota") || apiError.status === 429)) {
        aiReply = "I'm sorry, I'm experiencing a high volume of requests or a technical issue. Would you like me to create a support ticket so an agent can assist you directly?";
      } else {
        aiReply = "I'm having a little trouble processing that right now. Could I help you create a support ticket for an agent to review?";
      }
    }

    // 4. Save AI reply in Message model
    const aiMessage = new Message({
      conversation: conversationId,
      business: conversation.business._id,
      message: aiReply,
      sender: "ai",
      isAiResponse: true
    });

    await aiMessage.save();

    conversation.lastMessage = aiReply;
    conversation.lastMessageTime = new Date();
    conversation.totalMessages += 1;
    await conversation.save();

    // 5. Return response
    res.status(200).json({
      success: true,
      message: "AI reply generated successfully",
      aiReply: aiReply,
      data: aiMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating AI reply",
      error: error.message
    });
  }
};

const generateBusinessAssistantReply = async (req, res) => {
  try {
    const { message, businessId } = req.body;

    if (!message || !businessId) {
      return res.status(400).json({
        success: false,
        message: "Message and business ID are required"
      });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    // Fetch knowledge base to give context about their own business
    const knowledge = await Knowledge.find({ business: businessId, isActive: true });
    const businessContext = knowledge.map(k => `Topic: ${k.title}\nContent: ${k.content}`).join("\n\n");

    const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
    
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are the SupportAI Business Assistant, a powerful AI like ChatGPT, specifically designed to help the owner of ${business.businessName}.
          
          YOUR ROLE:
          - Help the business owner manage their support, improve their knowledge base, and grow their business.
          - You have access to their current knowledge base context below.
          - You can help them draft new knowledge base articles, suggest improvements to their support flow, or just answer general business questions.
          - Be highly intelligent, strategic, and helpful.

          THEIR BUSINESS CONTEXT:
          ${businessContext || "No knowledge base entries yet."}`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const aiReply = response.choices[0].message.content;

    res.status(200).json({
      success: true,
      aiReply: aiReply
    });
  } catch (error) {
    console.error("Business Assistant Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating assistant reply",
      error: error.message
    });
  }
};

module.exports = {
  generateAIReply,
  generateBusinessAssistantReply
};
