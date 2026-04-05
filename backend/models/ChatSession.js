const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true }, // Ties the chat to the user's browser
    status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
    unreadByAdmin: { type: Boolean, default: true },
    messages: [{
        sender: { type: String, enum: ['user', 'admin'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);