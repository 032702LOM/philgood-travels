const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET: Fetch all dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // 1. Fetch all bookings and users from the database
        const allBookings = await Booking.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        const allUsers = await User.find().sort({ createdAt: -1 }).select('-password'); // Exclude passwords!

        // 2. Calculate Total Revenue (Only from Confirmed/Paid bookings)
        let totalRevenue = 0;
        allBookings.forEach(booking => {
            if (booking.bookingStatus !== 'Cancelled') {
                const paidAmount = booking.payments.reduce((acc, p) => p.status === 'Paid' ? acc + p.amountDue : acc, 0);
                totalRevenue += paidAmount;
            }
        });

        // 3. Send the packaged data back to the frontend dashboard
        res.status(200).json({
            totalUsers: allUsers.length,
            totalBookings: allBookings.length,
            totalRevenue: totalRevenue,
            recentBookings: allBookings.slice(0, 10), // Send the 10 most recent bookings
            recentUsers: allUsers.slice(0, 5),        // Send the 5 newest users
            allBookings: allBookings                  // Send all for the data table
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch admin statistics." });
    }
});

// PUT: Admin can quickly update a booking status (e.g., mark as confirmed/cancelled)
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