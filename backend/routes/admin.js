const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Message = require('../models/Message');
const { Resend } = require('resend');
const Subscriber = require('../models/Subscriber');
const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Fetch all dashboard statistics
router.get('/stats', async (req, res) => {
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
        console.error("Admin Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch admin statistics." });
    }
});

// PUT: Update a booking status & AUTOMATICALLY LOG IT
router.put('/booking-status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        booking.bookingStatus = status;
        await booking.save();
        
        // ⚡ NEW: Automated System Logging ⚡
        if (booking.userId) {
            const user = await User.findById(booking.userId);
            if (user) {
                user.adminNotes.push({
                    text: `System: Booking #${booking._id.toString().substring(0,8).toUpperCase()} status updated to ${status}`,
                    authorInitials: '⚙️' // Using a gear icon to represent the automated system
                });
                await user.save();
            }
        }
        
        res.status(200).json({ message: "Status updated successfully!", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to update status." });
    }
});

// ⚡ UPDATED PUT: Edit User Details (Now includes Address, Marketing, Tax) ⚡
router.put('/user/:id', async (req, res) => {
    try {
        const { name, email, isAdmin, address, marketing, tax } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;
        
        if (address) user.address = address;
        if (marketing) user.marketing = marketing;
        if (tax) user.tax = tax;

        await user.save();
        
        const updatedUser = await User.findById(req.params.id).select('-password');
        res.status(200).json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user." });
    }
});

// DELETE: Delete user
router.delete('/user/:id', async (req, res) => {
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

// POST: Send a marketing broadcast to all subscribers
router.post('/broadcast', async (req, res) => {
    try {
        const { subject, htmlContent } = req.body;

        if (!subject || !htmlContent) {
            return res.status(400).json({ error: "Subject and HTML content are required." });
        }

        // 1. Fetch your master list of subscribers
        const subscribers = await Subscriber.find({});
        if (subscribers.length === 0) {
            return res.status(400).json({ error: "Your subscriber list is empty!" });
        }

        // 2. Format the payload for Resend's Batch API
        const emailBatch = subscribers.map(sub => ({
            from: 'PhilGood Travels <onboarding@resend.dev>', // Update this once you add a custom domain to Resend
            to: sub.email,
            subject: subject,
            html: htmlContent
        }));

        // Note: Resend's batch.send accepts up to 100 emails per call. 
        // If your list grows beyond 100, you will need to slice the array into chunks of 100.
        const response = await resend.batch.send(emailBatch);

        res.status(200).json({ message: `Success! Blast sent to ${subscribers.length} subscribers.` });
    } catch (error) {
        console.error("Broadcast Error:", error);
        res.status(500).json({ error: "Failed to send newsletter blast." });
    }
});

module.exports = router;