const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST: Create a new booking
router.post('/create', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "✅ Booking saved successfully!", booking: newBooking });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Failed to save booking." });
    }
});

// GET: Fetch all bookings for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        // Find all bookings that match this user's ID
        const userBookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(userBookings);
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        res.status(500).json({ error: "Failed to fetch bookings." });
    }
});

module.exports = router;