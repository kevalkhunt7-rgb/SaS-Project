const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Ticket = require("../models/Ticket");
const Business = require("../models/Business");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const businessId = business._id;
    const totalConversations = await Conversation.countDocuments({ business: businessId });
    const totalTickets = await Ticket.countDocuments({ business: businessId });
    const totalMessages = await Message.countDocuments({ business: businessId });
    const aiRepliesCount = await Message.countDocuments({ business: businessId, isAiResponse: true });
    const customerMessagesCount = await Message.countDocuments({ business: businessId, sender: "customer" });
    const openTickets = await Ticket.countDocuments({ business: businessId, status: "Open" });

    res.status(200).json({
      success: true,
      stats: {
        totalConversations,
        totalTickets,
        totalMessages,
        aiRepliesCount,
        customerMessagesCount,
        openTickets
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message
    });
  }
};

const getDashboardCharts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const business = await Business.findOne({ owner: userId }).select("_id");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const businessId = business._id;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const conversationsByDay = await Conversation.aggregate([
      {
        $match: {
          business: businessId,
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const messagesByDay = await Message.aggregate([
      {
        $match: {
          business: businessId,
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$sender"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    res.status(200).json({
      success: true,
      charts: {
        conversationsByDay,
        messagesByDay
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard charts",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardCharts
};
