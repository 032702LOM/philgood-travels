const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookmarks: [{ type: String }],
    isAdmin: { type: Boolean, default: false },
    // ⚡ NEW: Stores your Timeline comments for this specific customer
    adminNotes: [{
        text: String,
        authorInitials: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);