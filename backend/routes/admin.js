const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Message = require('../models/Message');
const ChatSession = require('../models/ChatSession');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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

// DELETE: Delete user
router.delete('/user/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user." });
    }
});

// PUT: Mark message as read
router.put('/message/:id', async (req, res) => {
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
router.delete('/message/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message." });
    }
});

// ⚡ NEW POST: Add a timeline note to a user
router.post('/user/:id/notes', async (req, res) => {
    try {
        const { text, authorInitials } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Add the new note to the top of their timeline
        user.adminNotes.push({ text, authorInitials });
        await user.save();

        // Return the freshly updated user to the frontend
        const updatedUser = await User.findById(req.params.id).select('-password');
        res.status(200).json({ message: "Note added!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to add note." });
    }
});

// POST: Send a marketing broadcast
router.post('/broadcast', async (req, res) => {
    try {
        const { subject, htmlContent } = req.body;

        if (!subject || !htmlContent) {
            return res.status(400).json({ error: "Subject and HTML content are required." });
        }

        // We know this exact command works for our  booking emails!
        // We are hardcoding our email just for this test to guarantee delivery.
        await resend.emails.send({
            from: 'PhilGood Travels <onboarding@resend.dev>', 
            to: 'techtacoder@gmail.com', 
            subject: subject,
            html: htmlContent
        });

        console.log("✅ Newsletter sent successfully to Resend!");
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.error("Broadcast Error:", error);
        res.status(500).json({ error: "Failed to send newsletter blast." });
    }
});


// GET: All active chat sessions for the admin dashboard
router.get('/chats', async (req, res) => {
    try {
        // Fetch sessions sorted by most recent activity
        const chats = await ChatSession.find({ status: 'Active' }).sort({ updatedAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: "Failed to load chat sessions." });
    }
});

// ⚡ DELETE A CHAT SESSION
router.delete('/chats/:sessionId', async (req, res) => {
    try {
        await ChatSession.findOneAndDelete({ sessionId: req.params.sessionId });
        res.status(200).json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: 'Failed to delete chat session' });
    }
});
module.exports = router;