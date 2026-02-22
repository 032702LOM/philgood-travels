const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer'); 

// 1. Initialize Stripe using your Secret Key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 2. Set up Nodemailer Transport (Updated for Port 587/Render compatibility)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Port 587 requires this to be false
    requireTLS: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps avoid handshake errors on Render
    }
});

// ==========================================
// POST: Create a new booking & Send Emails
// ==========================================
router.post('/create', async (req, res) => {
    try {
        const { userId, packageName, travelDate, guests, totalPrice, paymentMethod, splitBetween = 1, friendEmails = [] } = req.body;

        const amountDue = totalPrice / splitBetween;
        let paymentsArray = [];

        // Generate Stripe links for everyone
        for (let i = 0; i < splitBetween; i++) {
            const payerEmail = friendEmails[i] || `guest${i+1}@pending.com`;

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: payerEmail,
                line_items: [{
                    price_data: {
                        currency: 'php',
                        product_data: { name: `${packageName} - Split Share (${i + 1} of ${splitBetween})` },
                        unit_amount: Math.round(amountDue * 100), 
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://philgood-travels.vercel.app/profile?payment=success', 
                cancel_url: 'https://philgood-travels.vercel.app/profile?payment=cancelled',
            });

            paymentsArray.push({
                payerEmail: payerEmail,
                amountDue: amountDue,
                amountPaid: 0,
                status: 'Pending',
                paymentUrl: session.url 
            });
        }

        // Save to Database
        const newBooking = new Booking({
            userId, packageName, travelDate, guests, totalPrice, paymentMethod,
            bookingStatus: 'Pending', splitBetween, payments: paymentsArray
        });

        await newBooking.save();

        // ⚡ SEND AUTOMATED EMAILS ⚡
        try {
            for (const payment of paymentsArray) {
                if (!payment.payerEmail.includes('@pending.com')) {
                    const mailOptions = {
                        from: `"PhilGood Travels" <${process.env.EMAIL_USER}>`,
                        to: payment.payerEmail,
                        subject: `Your Invoice & Payment Link for ${packageName}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                                <h2 style="color: #2A9D8F; text-align: center;">PhilGood Travels</h2>
                                <p style="font-size: 16px;">Hello!</p>
                                <p style="font-size: 16px;">You have a pending invoice for the upcoming trip to <strong>${packageName}</strong> on <strong>${travelDate}</strong>.</p>
                                
                                <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #2A9D8F;">
                                    <h3 style="margin-top: 0; color: #333;">Invoice Details:</h3>
                                    <p style="margin: 5px 0;"><strong>Total Amount Due:</strong> ₱${payment.amountDue.toLocaleString()}</p>
                                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #FF8C73; font-weight: bold;">Pending</span></p>
                                </div>

                                <p style="font-size: 16px;">To secure your spot, please click the secure link below to pay your share:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${payment.paymentUrl}" style="background-color: #2A9D8F; color: white; padding: 14px 28px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 50px; display: inline-block;">Pay My Share</a>
                                </div>
                                <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
                                <p style="font-size: 12px; color: #888; text-align: center;">If you did not request this booking, please ignore this email.</p>
                            </div>
                        `
                    };
                    await transporter.sendMail(mailOptions);
                    console.log(`✅ Invoice email sent to: ${payment.payerEmail}`);
                }
            }
        } catch (emailError) {
            console.error("⚠️ Booking saved, but email sending failed:", emailError);
        }
        
        res.status(201).json({ message: "✅ Booking created and emails sent!", booking: newBooking });
        
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

// DELETE: Remove a duplicate or unwanted booking
router.delete('/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking permanently deleted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete booking." });
    }
});

// PUT: Cancel a booking (Must be 2 days prior)
router.put('/cancel/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found." });

        const travelDate = new Date(booking.travelDate);
        const today = new Date();
        const diffDays = (travelDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

        if (diffDays < 2) {
            return res.status(400).json({ error: "You can only cancel at least 2 days before travel." });
        }

        booking.bookingStatus = 'Cancelled';
        booking.cancelledAt = new Date(); 
        await booking.save();
        res.status(200).json({ message: "Booking cancelled successfully.", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel booking." });
    }
});

// PUT: Postpone a booking (Max 2 times, 2 days prior)
router.put('/postpone/:id', async (req, res) => {
    try {
        const { newDate } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found." });

        if ((booking.postponeCount || 0) >= 2) {
            return res.status(400).json({ error: "You have reached the maximum limit of 2 postponements." });
        }

        const travelDate = new Date(booking.travelDate);
        const today = new Date();
        const diffDays = (travelDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

        if (diffDays < 2) {
            return res.status(400).json({ error: "You can only postpone at least 2 days before travel." });
        }

        booking.travelDate = newDate;
        booking.bookingStatus = 'Postponed'; 
        booking.postponeCount = (booking.postponeCount || 0) + 1; 
        await booking.save();
        res.status(200).json({ message: "Booking postponed successfully.", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to postpone booking." });
    }
});

// PUT: Rebook a Cancelled Trip
router.put('/rebook/:id', async (req, res) => {
    try {
        const { newDate } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) return res.status(404).json({ error: "Booking not found." });

        if (booking.cancelledAt) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (new Date(booking.cancelledAt) < oneMonthAgo) {
                return res.status(400).json({ error: "Rebooking period (1 month) has expired." });
            }
        }

        booking.travelDate = newDate;
        
        const allPaid = booking.payments.length > 0 && booking.payments.every(p => p.status === 'Paid');
        booking.bookingStatus = allPaid ? 'Confirmed' : 'Pending';
        
        await booking.save();
        res.status(200).json({ message: "Trip successfully rebooked!", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to rebook." });
    }
});

module.exports = router;