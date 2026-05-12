const express = require("express");
const chats = require("../models/Chats");
const authMiddleware = require("../middleware/authMiddleware");

const startChat = async (req, res) => {

try {
    const { businessId } = req.params;
    const  userId  = req.user._id;
    const newChat = new chats({
        business: businessId,
        customer: userId,
        message: "Hi! How can I help you today?",
        sender: "agent",
    });
    await newChat.save();
    res.status(201).json({
        success: true,
        message: "Chat started successfully",
        chat: newChat
    });

} catch (error) {
    res.status(500).json({
        success: false,
        message: "Error starting chat",
        error: error.message
    });
}
}

const customerMessage = async (req, res) => {
try {
    const { businessId } = req.params;
    const { message } = req.body;
    const  userId  = req.user._id;
    const newMessage = new chats({
        business: businessId,
        customer: userId,
        message,
        sender: "customer",
    });
    await newMessage.save();
    res.status(201).json({
        success: true,
        message: "Customer message sent successfully",
        chat: newMessage
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: "Error sending customer message",
        error: error.message
    });
}
}

module.exports = {
    startChat,
    customerMessage
}