const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Message = require('../models/Message');

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

// PUT: Update a booking status
router.put('/booking-status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        booking.bookingStatus = status;
        await booking.save();
        
        res.status(200).json({ message: "Status updated successfully!", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to update status." });
    }
});

// ⚡ NEW PUT: Edit User Details ⚡
router.put('/user/:id', async (req, res) => {
    try {
        const { name, email, isAdmin } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;

        await user.save();
        
        // Return the updated user (excluding password)
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

module.exports = router;