const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User'); 
const nodemailer = require('nodemailer'); 

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    requireTLS: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false 
    }
});

// ==========================================
// POST: Create a new booking & Send Emails
// ==========================================
router.post('/create', async (req, res) => {
    try {
        // ⚡ NEW: We now accept invoiceDetails from the frontend request
        const { userId, packageName, travelDate, guests, totalPrice, paymentMethod, splitBetween = 1, friendEmails = [], invoiceDetails } = req.body;

        const leadUser = await User.findById(userId);
        const leadName = leadUser ? leadUser.name : "A friend";

        const amountDue = totalPrice / splitBetween;
        let paymentsArray = [];

        for (let i = 0; i < splitBetween; i++) {
            const payerEmail = friendEmails[i] || `guest${i+1}@pending.com`;

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer_email: payerEmail.includes('@pending.com') ? undefined : payerEmail,
                line_items: [{
                    price_data: {
                        currency: 'php',
                        product_data: { 
                            name: `${packageName} - Split Share`,
                            description: `Payment ${i + 1} of ${splitBetween} for trip on ${travelDate}`
                        },
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

        // ⚡ NEW: Save the invoiceDetails to the Database
        const newBooking = new Booking({
            userId, packageName, travelDate, guests, totalPrice, paymentMethod, invoiceDetails,
            bookingStatus: 'Pending', splitBetween, payments: paymentsArray
        });

        await newBooking.save();

        // ⚡ SEND AUTOMATED EMAILS TO PAYEES ⚡
        try {
            // Helper function to format numbers as PHP currency safely
            const formatPHP = (num) => num ? `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₱0.00';
            const totalHeads = (guests.adults || 0) + (guests.children || 0) + (guests.infants || 0);

            for (const payment of paymentsArray) {
                if (!payment.payerEmail.includes('@pending.com')) {
                    await transporter.sendMail({
                        from: `"PhilGood Travels" <${process.env.EMAIL_USER}>`,
                        to: payment.payerEmail,
                        subject: `Action Required: Join ${leadName} on a trip to ${packageName}!`,
                        html: `
                            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #E0F7FA; border-radius: 16px; background-color: #FFFFFF;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <h2 style="color: #023E8A; text-transform: uppercase; letter-spacing: 2px; margin: 0;">PhilGood Travels</h2>
                                </div>
                                <p style="font-size: 16px; color: #4A5568;">Hi there!</p>
                                <p style="font-size: 16px; color: #4A5568;"><strong>${leadName}</strong> is planning an adventure to <strong style="color: #00B4D8;">${packageName}</strong> on <strong>${travelDate}</strong> and has invited you to join!</p>
                                
                                <div style="background-color: #F4FAFC; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #00B4D8;">
                                    <h3 style="margin-top: 0; color: #023E8A; font-size: 18px; border-bottom: 1px solid rgba(0, 180, 216, 0.2); padding-bottom: 10px;">Price Summary</h3>
                                    
                                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4A5568;">
                                        <tr>
                                            <td style="padding: 8px 0;">Base Price (x${guests.adults || 1})</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${formatPHP(invoiceDetails?.basePriceTotal)}</td>
                                        </tr>
                                        ${invoiceDetails?.accClassTotal > 0 ? `
                                        <tr>
                                            <td style="padding: 8px 0;">${invoiceDetails?.accClassText}</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${formatPHP(invoiceDetails?.accClassTotal)}</td>
                                        </tr>` : ''}
                                        ${invoiceDetails?.transferTotal > 0 ? `
                                        <tr>
                                            <td style="padding: 8px 0;">Airport Transfer</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${formatPHP(invoiceDetails?.transferTotal)}</td>
                                        </tr>` : ''}
                                        ${invoiceDetails?.insuranceTotal > 0 ? `
                                        <tr>
                                            <td style="padding: 8px 0;">Insurance (x${totalHeads})</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${formatPHP(invoiceDetails?.insuranceTotal)}</td>
                                        </tr>` : ''}
                                        ${invoiceDetails?.dinnerTotal > 0 ? `
                                        <tr>
                                            <td style="padding: 8px 0;">Romantic Dinner</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: bold;">${formatPHP(invoiceDetails?.dinnerTotal)}</td>
                                        </tr>` : ''}
                                        ${invoiceDetails?.carbonTotal > 0 ? `
                                        <tr>
                                            <td style="padding: 8px 0; color: #4CAF50;">Carbon Offset (x${totalHeads})</td>
                                            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #4CAF50;">${formatPHP(invoiceDetails?.carbonTotal)}</td>
                                        </tr>` : ''}
                                        <tr>
                                            <td style="padding: 8px 0; border-top: 1px solid rgba(0, 180, 216, 0.2); padding-top: 15px;">VAT (12%)</td>
                                            <td style="padding: 8px 0; border-top: 1px solid rgba(0, 180, 216, 0.2); padding-top: 15px; text-align: right; font-weight: bold;">${formatPHP(invoiceDetails?.vatTotal)}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 15px 0 5px 0; font-size: 18px; color: #023E8A; font-weight: bold;">Grand Total</td>
                                            <td style="padding: 15px 0 5px 0; font-size: 18px; color: #FF9F1C; text-align: right; font-weight: bold;">${formatPHP(totalPrice)}</td>
                                        </tr>
                                    </table>
                                </div>

                                <div style="background-color: #023E8A; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; color: #FFFFFF;">
                                    <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your Split Share (${splitBetween} ways):</p>
                                    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #FF9F1C;">${formatPHP(payment.amountDue)}</p>
                                </div>

                                <p style="font-size: 16px; color: #4A5568; text-align: center;">To secure your spot and confirm the group booking, please pay your share via our secure Stripe link:</p>
                                
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="${payment.paymentUrl}" style="background-color: #FF9F1C; color: #023E8A; padding: 18px 40px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 50px; display: inline-block; box-shadow: 0 4px 15px rgba(255, 159, 28, 0.4);">PAY MY SHARE NOW</a>
                                </div>

                                <p style="font-size: 14px; color: #A0AEC0; text-align: center; line-height: 1.5;">
                                    This is a group booking. The entire trip will be officially confirmed once all members have completed their individual payments.
                                </p>
                            </div>
                        `
                    });
                }
            }
            console.log("✅ All payee emails processed.");
        } catch (emailError) {
            console.error("⚠️ Booking saved, but email sending encountered an error:", emailError);
        }
        
        res.status(201).json({ message: "✅ Booking created and emails sent!", booking: newBooking });
        
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Failed to process booking with Stripe." });
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