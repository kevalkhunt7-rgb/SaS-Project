const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message, sender } = req.body;

    if (!conversationId || !message || !sender) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID, message, and sender are required"
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const newMessage = new Message({
      conversation: conversationId,
      business: conversation.business,
      message,
      sender,
      isAiResponse: sender === "ai"
    });

    await newMessage.save();

    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();
    conversation.totalMessages += 1;
    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message
    });
  }
};

const getMessagesByConversationId = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message
      .find({ conversation: conversationId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessagesByConversationId
};
