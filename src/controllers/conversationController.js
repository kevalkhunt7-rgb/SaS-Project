const Conversation = require("../models/Conversation");
const Business = require("../models/Business");

const startConversation = async (req, res) => {
  try {
    const { businessId, customerName, customerEmail } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required"
      });
    }

    const newConversation = new Conversation({
      business: businessId,
      customerName: customerName || "Guest",
      customerEmail: customerEmail,
      lastMessage: "Hi! How can I help you today?",
      lastMessageTime: new Date()
    });

    await newConversation.save();

    res.status(201).json({
      success: true,
      message: "Conversation started successfully",
      conversation: newConversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error starting conversation",
      error: error.message
    });
  }
};

const getBusinessConversations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const conversations = await Conversation
      .find({ business: business._id })
      .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      conversations: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message
    });
  }
};

const getConversationById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      business: business._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      conversation: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching conversation",
      error: error.message
    });
  }
};

const closeConversation = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, business: business._id },
      { status: "closed" },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation closed successfully",
      conversation: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error closing conversation",
      error: error.message
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      business: business._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting conversation",
      error: error.message
    });
  }
};

module.exports = {
  startConversation,
  getBusinessConversations,
  getConversationById,
  closeConversation,
  deleteConversation
};
