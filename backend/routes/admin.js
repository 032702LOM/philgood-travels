const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const sendEmail = require('../services/emailService');

// ⚡ IMPORT THE NEW BOUNCERS ⚡
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ==========================================
// PROTECTED ROUTES
// We add [verifyToken, isAdmin] to every sensitive route.
// ==========================================

// GET: Fetch all dashboard statistics
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        const allUsers = await User.find().sort({ createdAt: -1 }).select('-password'); 
        const allMessages = await Message.find().sort({ createdAt: -1 });

        let totalRevenue = 0;
        allBookings.forEach(booking => {
            if (booking.bookingStatus !== 'Cancelled') {
                const paidAmount = booking.payments.reduce((acc, p) => p.status === 'Paid' ? acc + p.amountDue : acc, 0);
                totalRevenue += paidAmount;
            }
        });

        res.status(200).json({
            totalUsers: allUsers.length,
            totalBookings: allBookings.length,
            totalRevenue: totalRevenue,
            allBookings: allBookings,
            allUsers: allUsers,
            allMessages: allMessages
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admin statistics." });
    }
});

// GET: All active chat sessions
router.get('/chats', verifyToken, isAdmin, async (req, res) => {
    try {
        const chats = await ChatSession.find({ status: 'Active' }).sort({ updatedAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: "Failed to load chat sessions." });
    }
});

// ⚡ DELETE A CHAT SESSION
router.delete('/chats/:sessionId', verifyToken, isAdmin, async (req, res) => {
    try {
        await ChatSession.findOneAndDelete({ sessionId: req.params.sessionId });
        res.status(200).json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: 'Failed to delete chat session' });
    }
});

// POST: Add a timeline note to a user
router.post('/user/:id/notes', verifyToken, isAdmin, async (req, res) => {
    try {
        const { text, authorInitials } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.adminNotes.push({ text, authorInitials });
        await user.save();

        const updatedUser = await User.findById(req.params.id).select('-password');
        res.status(200).json({ message: "Note added!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to add note." });
    }
});

// ⚡ NEW PUT: Update User Profile (Admin Action) with Auto-logging
router.put('/user/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        // 1. Grab everything, including the new customerType
        const { name, email, isAdmin, address, marketing, tax, customerType } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ error: "User not found" });

        // 2. Track exactly what changed
        let changes = [];
        
        if (name && user.name !== name) { user.name = name; changes.push('Name'); }
        if (email && user.email !== email) { user.email = email; changes.push('Email'); }
        if (isAdmin !== undefined && user.isAdmin !== isAdmin) { user.isAdmin = isAdmin; changes.push('Admin Role'); }
        
        // ⚡ NEW: Track Customer Type changes
        if (customerType && user.customerType !== customerType) { 
            user.customerType = customerType; 
            changes.push(`Customer Type (${customerType})`); 
        }

        // Address Details
        if (address) {
            if (user.address.phone !== address.phone) { user.address.phone = address.phone; changes.push('Phone'); }
            if (user.address.street !== address.street) { user.address.street = address.street; changes.push('Street'); }
            if (user.address.city !== address.city) { user.address.city = address.city; changes.push('City'); }
            if (user.address.postalCode !== address.postalCode) { user.address.postalCode = address.postalCode; changes.push('Postal Code'); }
            if (user.address.country !== address.country) { user.address.country = address.country; changes.push('Country'); }
        }

        // Marketing Preferences
        if (marketing) {
            if (user.marketing.email !== marketing.email) { user.marketing.email = marketing.email; changes.push('Email Marketing'); }
            if (user.marketing.sms !== marketing.sms) { user.marketing.sms = marketing.sms; changes.push('SMS Marketing'); }
        }

        // Tax Details
        if (tax) {
            if (user.tax.vatNumber !== tax.vatNumber) { user.tax.vatNumber = tax.vatNumber; changes.push('VAT Number'); }
            if (user.tax.collectTax !== tax.collectTax) { user.tax.collectTax = tax.collectTax; changes.push('Tax Collection'); }
        }

        // 3. Auto-generate a comment ONLY if changes were actually made
        if (changes.length > 0) {
            user.adminNotes.push({
                text: `System: Admin updated the following profile details: ${changes.join(', ')}.`,
                authorInitials: '⚙️'
            });
            await user.save(); 
        }

        // 4. Return the fresh user object
        const updatedUser = await User.findById(req.params.id).select('-password');
        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Admin Update Error:", error);
        res.status(500).json({ error: "Failed to update user profile." });
    }
});

// DELETE: Delete user
router.delete('/user/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user." });
    }
});

// PUT: Update a booking status
router.put('/booking-status/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        booking.bookingStatus = status;
        await booking.save();
        
        if (booking.userId) {
            const user = await User.findById(booking.userId);
            if (user) {
                user.adminNotes.push({
                    text: `System: Booking #${booking._id.toString().substring(0,8).toUpperCase()} status updated to ${status}`,
                    authorInitials: '⚙️'
                });
                await user.save();
            }
        }
        res.status(200).json({ message: "Status updated successfully!", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to update status." });
    }
});

// PUT: Mark message as read
router.put('/message/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        message.status = 'Read';
        await message.save();
        res.status(200).json({ message: "Marked as read." });
    } catch (error) {
        res.status(500).json({ error: "Failed to update message." });
    }
});

// DELETE: Delete message
router.delete('/message/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message." });
    }
});

// POST: Send a marketing broadcast
router.post('/broadcast', verifyToken, isAdmin, async (req, res) => {
    try {
        const { subject, htmlContent } = req.body;

        if (!subject || !htmlContent) {
            return res.status(400).json({ error: "Subject and HTML content are required." });
        }

        // ⚡ NOW USING GMAIL API VIA OUR SERVICE
        await sendEmail({
            to: process.env.GMAIL_USER, // Sending to your admin hub
            subject: subject,
            html: htmlContent
        });

        console.log("✅ Admin broadcast sent successfully via Gmail API!");
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.error("Broadcast Error:", error);
        res.status(500).json({ error: "Failed to send newsletter blast." });
    }
});

module.exports = router;