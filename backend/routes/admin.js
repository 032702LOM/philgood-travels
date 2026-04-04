const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET: Fetch all dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        const allUsers = await User.find().sort({ createdAt: -1 }).select('-password'); 

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
            recentBookings: allBookings.slice(0, 10), 
            recentUsers: allUsers.slice(0, 5),        
            allBookings: allBookings                  
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch admin statistics." });
    }
});

// PUT: Admin can quickly update a booking status
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

module.exports = router;