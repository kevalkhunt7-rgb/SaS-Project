const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    customer: {
        type: String,
        ref: 'User',
        required: true,
    },  
    customerName: {
        type: String,
    },
    customerEmail: {
        type: String,
    },
    message:{
        type: String,
        required: true,
    },
    sender:{
        type: String,
        enum: ['customer','ai', 'agent'],
        required: true,
    },
    isAiResponse:{
        type: Boolean,
        default: false,
    },
    conversationId:{
        type: String,
    },
    status: {
        type: String,
        enum: ['active','Closed'],
        default: 'active',
    },
},{timestamps: true});

module.exports = mongoose.model('Chat', ChatSchema)