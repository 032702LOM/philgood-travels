const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. Initialize Stripe using your Secret Key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST: Create a new booking
router.post('/create', async (req, res) => {
    try {
        // Extract all the data sent from the React frontend
        const { userId, packageName, travelDate, guests, totalPrice, paymentMethod, splitBetween = 1, friendEmails = [] } = req.body;

        // 2. Calculate how much each person owes
        const amountDue = totalPrice / splitBetween;
        let paymentsArray = [];

        // 3. Generate a unique Stripe Checkout link for each person
        for (let i = 0; i < splitBetween; i++) {
            // Assign an email (Lead gets the first one, friends get the rest, or a placeholder)
            const payerEmail = friendEmails[i] || `guest${i+1}@pending.com`;

            // Tell Stripe to create a checkout page for this share of the trip
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: payerEmail,
                line_items: [{
                    price_data: {
                        currency: 'php', // Philippine Peso
                        product_data: {
                            name: `${packageName} - Split Share (${i + 1} of ${splitBetween})`,
                        },
                        // Stripe expects amounts in cents/centavos, so we multiply by 100!
                        unit_amount: Math.round(amountDue * 100), 
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://philgood-travels.vercel.app/profile?payment=success', // Where to go after paying
                cancel_url: 'https://philgood-travels.vercel.app/profile?payment=cancelled',
            });

            // Add this specific invoice and Stripe URL to our database list
            paymentsArray.push({
                payerEmail: payerEmail,
                amountDue: amountDue,
                amountPaid: 0,
                status: 'Pending',
                paymentUrl: session.url // 👈 This is the magic clickable link!
            });
        }

        // 4. Save the upgraded booking to MongoDB
        const newBooking = new Booking({
            userId,
            packageName,
            travelDate,
            guests,
            totalPrice,
            paymentMethod,
            bookingStatus: 'Pending', // Held as Pending until everyone pays
            splitBetween,
            payments: paymentsArray
        });

        await newBooking.save();
        
        // 5. Send success message back to the frontend
        res.status(201).json({ message: "✅ Booking and Split Payments created!", booking: newBooking });
        
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Failed to save booking with Stripe." });
    }
});

// GET: Fetch all bookings for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const userBookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(userBookings);
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        res.status(500).json({ error: "Failed to fetch bookings." });
    }
});

module.exports = router;