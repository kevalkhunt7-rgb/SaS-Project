const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
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
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', "resolved",'Closed'],
        default: 'Open',
    },
    assignAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},{timestamps: true});

const Ticket = mongoose.model('Ticket', ticketSchema)
module.exports = Ticket