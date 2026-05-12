const User = require("../models/User");
const Business = require("../models/Business");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Ticket = require("../models/Ticket");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBusinesses = await Business.countDocuments();
        const totalConversations = await Conversation.countDocuments();
        const totalMessages = await Message.countDocuments();
        const totalTickets = await Ticket.countDocuments();

        // Get growth (simple count from last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newBusinesses = await Business.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newConversations = await Conversation.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalBusinesses,
                totalConversations,
                totalMessages,
                totalTickets,
                growth: {
                    users: newUsers,
                    businesses: newBusinesses,
                    conversations: newConversations
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching admin stats",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").lean();
        
        // Since business link might be missing in User model, fetch them manually
        const usersWithBusiness = await Promise.all(users.map(async (user) => {
            const business = await Business.findOne({ owner: user._id }).select("businessName slug").lean();
            return { ...user, business };
        }));

        res.status(200).json({
            success: true,
            users: usersWithBusiness
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find().populate("owner", "name email").lean();
        res.status(200).json({
            success: true,
            businesses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching businesses",
            error: error.message
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!["owner", "admin", "agent", "customer"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user role",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Optional: Delete associated business
        await Business.deleteOne({ owner: id });
        
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User and associated business deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

const deleteBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        await Business.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Business deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting business",
            error: error.message
        });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    getAllBusinesses,
    updateUserRole,
    deleteUser,
    deleteBusiness
};
