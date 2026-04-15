const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');
const User = require('../models/User'); 
const { Resend } = require('resend'); 

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// POST: Create a new booking & Send Emails
// ==========================================
router.post('/create', async (req, res) => {
    try {
        const { userId, packageName, travelDate, guests, totalPrice, paymentMethod, splitBetween = 1, friendEmails = [], invoiceDetails } = req.body;

        const leadUser = await User.findById(userId);
        const leadName = leadUser ? leadUser.name : "A friend";

        const amountDue = totalPrice / splitBetween;
        const safeInvoice = invoiceDetails || {};
        let paymentsArray = [];

        // ⚡ PAYMONGO BASIC AUTH: Base64 encode the secret key
        const paymongoAuth = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64');

        // Helper to build line items specifically for PayMongo
        const buildPaymongoLineItems = () => {
            const items = [];
            const split = splitBetween || 1;
            const splitText = split > 1 ? ` (Split ${split} ways)` : '';

            // PayMongo amounts MUST be integers in centavos (multiply by 100)
            if (safeInvoice.basePriceTotal > 0) items.push({ name: `Base Price${splitText}`, amount: Math.round((safeInvoice.basePriceTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (safeInvoice.accClassTotal > 0) items.push({ name: `${safeInvoice.accClassText || 'Room Upgrade'}${splitText}`, amount: Math.round((safeInvoice.accClassTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (safeInvoice.transferTotal > 0) items.push({ name: `Airport Transfer${splitText}`, amount: Math.round((safeInvoice.transferTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (safeInvoice.insuranceTotal > 0) items.push({ name: `Travel Insurance${splitText}`, amount: Math.round((safeInvoice.insuranceTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (safeInvoice.dinnerTotal > 0) items.push({ name: `Romantic Dinner${splitText}`, amount: Math.round((safeInvoice.dinnerTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (safeInvoice.carbonTotal > 0) items.push({ name: `Carbon Offset${splitText}`, amount: Math.round((safeInvoice.carbonTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (safeInvoice.vatTotal > 0) items.push({ name: `VAT (12%)${splitText}`, amount: Math.round((safeInvoice.vatTotal / split) * 100), currency: 'PHP', quantity: 1 });

            // Fallback just in case invoice details are missing
            if (items.length === 0) {
                items.push({ name: `${packageName}${splitText}`, amount: Math.round(amountDue * 100), currency: 'PHP', quantity: 1 });
            }
            return items;
        };

        const paymongoItems = buildPaymongoLineItems();

        for (let i = 0; i < splitBetween; i++) {
            const payerEmail = friendEmails[i] || leadUser.email;
            
            // ⚡ CALL PAYMONGO API TO GENERATE CHECKOUT LINK ⚡
            const paymongoResponse = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
                data: {
                    attributes: {
                        send_email_receipt: true,
                        show_description: true,
                        show_line_items: true,
                        payment_method_types: ['card', 'gcash', 'paymaya', 'grabpay'],
                        line_items: paymongoItems,
                        success_url: `https://philgood-travels.vercel.app/profile?payment=success`,
                        cancel_url: `https://philgood-travels.vercel.app/profile`,
                        description: `Trip to ${packageName} | Travel Date: ${travelDate}`
                    }
                }
            }, {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `Basic ${paymongoAuth}`
                }
            });

            const checkoutUrl = paymongoResponse.data.data.attributes.checkout_url;
            const checkoutId = paymongoResponse.data.data.id;

            paymentsArray.push({
                payerEmail: payerEmail,
                amountDue: amountDue,
                status: 'Pending',
                paymentUrl: checkoutUrl,
                stripeSessionId: checkoutId // Kept this name so Mongoose doesn't break, but stores PayMongo ID
            });

            // --- SEND EMAIL VIA RESEND ---
            const isLead = (payerEmail === leadUser.email);
            const subject = isLead ? `Your Booking for ${packageName} is Pending` : `You've been invited on a trip to ${packageName}!`;
            
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>${isLead ? 'Hi ' + leadUser.name + ',' : 'Hi there!'}</h2>
                    <p>${isLead ? `Your trip to <strong>${packageName}</strong> is almost set!` : `<strong>${leadName}</strong> is inviting you on a trip to <strong>${packageName}</strong>!`}</p>
                    <p><strong>Travel Date:</strong> ${travelDate}</p>
                    <p>Your share of the trip comes out to <strong>₱${amountDue.toLocaleString()}</strong>.</p>
                    <a href="${checkoutUrl}" style="background-color: #00B4D8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; font-weight: bold;">
                        Pay Your Share Securely
                    </a>
                    <p style="margin-top: 20px; font-size: 0.9em; color: #666;">If the button doesn't work, copy and paste this link: <br/>${checkoutUrl}</p>
                </div>
            `;

            try {
                await resend.emails.send({
                    from: 'PhilGood Travels <onboarding@resend.dev>',
                    to: payerEmail, 
                    subject: subject,
                    html: htmlContent
                });
            } catch (emailErr) {
                console.error(`Failed to send email to ${payerEmail}:`, emailErr);
            }
        }

        const newBooking = new Booking({
            userId,
            packageName,
            travelDate,
            guests,
            totalPrice,
            paymentMethod: 'PayMongo Checkout', // Updated text
            splitBetween,
            payments: paymentsArray,
            invoiceDetails: invoiceDetails,
            bookingStatus: 'Pending'
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created and payment links generated!", booking: newBooking });

    } catch (error) {
        console.error("Booking Creation Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create booking and generate payment links." });
    }
});

// ==========================================
// PUT: Cancel a Trip
// ==========================================
router.put('/cancel/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found." });

        booking.bookingStatus = 'Cancelled';
        booking.cancelledAt = new Date(); 
        await booking.save();

        res.status(200).json({ message: "Booking cancelled successfully.", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel booking." });
    }
});

// ==========================================
// PUT: Postpone a Trip
// ==========================================
router.put('/postpone/:id', async (req, res) => {
    try {
        const { newDate } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) return res.status(404).json({ error: "Booking not found." });

        if (booking.postponeCount >= 2) {
            return res.status(400).json({ error: "You have reached the maximum limit of 2 postponements." });
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

// ==========================================
// PUT: Rebook a Cancelled Trip
// ==========================================
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
        booking.cancelledAt = null; 

        await booking.save();
        res.status(200).json({ message: "Booking rebooked successfully.", booking });
    } catch (error) {
        res.status(500).json({ error: "Failed to rebook." });
    }
});

// ==========================================
// GET: Fetch Bookings for a Specific User
// ==========================================
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings." });
    }
});

// ==========================================
// DELETE: Remove a booking permanently
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete booking." });
    }
});

module.exports = router;