const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({    
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    customerName: {
        type: String,
    },
    ratting: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    review: {
        type: String,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
    },
},{timestamps: true});

module.exports = mongoose.model('Feedback', feedbackSchema)