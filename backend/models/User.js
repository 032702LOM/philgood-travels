const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // ⚡ Email Verification Fields
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // ⚡ Password Reset Fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    bookmarks: [{ type: String }],
    isAdmin: { type: Boolean, default: false },
    adminNotes: [{
        text: String,
        authorInitials: String,
        createdAt: { type: Date, default: Date.now }
    }],
    address: {
        phone: { type: String, default: '' },
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    marketing: {
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
    },
    tax: {
        vatNumber: { type: String, default: '' },
        collectTax: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);