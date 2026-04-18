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
            
            // --- FORMAT CURRENCY HELPER ---
            const formatPrice = (num) => `₱${Number(num).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

            // --- BUILD ITEMIZED HTML ROWS ---
            let itemizedHtml = '';
            if (safeInvoice.basePriceTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Base Price</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(safeInvoice.basePriceTotal)}</td></tr>`;
            if (safeInvoice.accClassTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">${safeInvoice.accClassText || 'Room Upgrade'}</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(safeInvoice.accClassTotal)}</td></tr>`;
            if (safeInvoice.transferTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Airport Transfer</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(safeInvoice.transferTotal)}</td></tr>`;
            if (safeInvoice.insuranceTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Travel Insurance</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(safeInvoice.insuranceTotal)}</td></tr>`;
            if (safeInvoice.dinnerTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Romantic Dinner</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(safeInvoice.dinnerTotal)}</td></tr>`;
            if (safeInvoice.carbonTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #4CAF50;">Carbon Offset</td><td align="right" style="padding: 8px 0; color: #4CAF50; font-weight: bold;">${formatPrice(safeInvoice.carbonTotal)}</td></tr>`;
            if (safeInvoice.vatTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">VAT (12%)</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(safeInvoice.vatTotal)}</td></tr>`;

            // --- SEND EMAIL VIA RESEND ---
            const isLead = (payerEmail === leadUser.email);
            const subject = isLead ? `Your Booking for ${packageName} is Pending` : `You've been invited on a trip to ${packageName}!`;
            
            const introText = isLead 
                ? `You are planning an adventure to <strong style="color: #00B4D8;">${packageName}</strong> on <strong>${travelDate}</strong>! Let's get everything locked in.` 
                : `<strong>${leadName}</strong> is planning an adventure to <strong style="color: #00B4D8;">${packageName}</strong> on <strong>${travelDate}</strong> and has invited you to join!`;

            const htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                    
                    <h2 style="text-align: center; color: #003B5C; letter-spacing: 1px; text-transform: uppercase;">PHILGOOD TRAVELS</h2>
                    
                    <p>Hi there!</p>
                    <p>${introText}</p>

                    <div style="border: 1px solid #00B4D8; border-radius: 8px; padding: 20px; margin-top: 25px; background-color: #FAFAFA;">
                        <h3 style="color: #003B5C; margin-top: 0;">Price Summary</h3>
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                            ${itemizedHtml}
                            <tr>
                                <td colspan="2"><hr style="border: none; border-top: 1px solid #D0EBEF; margin: 15px 0;"></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #003B5C; font-weight: bold; font-size: 16px;">Grand Total</td>
                                <td align="right" style="padding: 8px 0; color: #F69928; font-weight: bold; font-size: 16px;">${formatPrice(totalPrice)}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #003B5C; border-radius: 8px; padding: 25px 20px; text-align: center; margin-top: 20px;">
                        <p style="color: #FFFFFF; font-size: 14px; margin: 0 0 10px 0;">Your Split Share (${splitBetween} ways):</p>
                        <h1 style="color: #F69928; margin: 0; font-size: 28px;">${formatPrice(amountDue)}</h1>
                    </div>

                    <p style="text-align: center; font-size: 14px; color: #555; margin-top: 20px;">
                        To secure your spot and confirm the group booking, please securely pay your share via PayMongo:
                    </p>

                    <div style="text-align: center; margin-top: 15px;">
                        <a href="${checkoutUrl}" style="background-color: #00B4D8; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                            PAY MY SHARE NOW
                        </a>
                    </div>
                </div>
            `;
            
            // ⚡ ACTUALLY SEND THE EMAIL ⚡
            try {
                await resend.emails.send({
                    from: 'PhilGood Travels <hello@philgoodtravels.com>', // Update with your verified Resend domain if needed
                    to: payerEmail,
                    subject: subject,
                    html: htmlContent
                });
            } catch (emailErr) {
                console.error("Failed to send email to", payerEmail, emailErr);
            }
        }

        const newBooking = new Booking({
            userId,
            packageName,
            travelDate,
            guests,
            totalPrice,
            paymentMethod: 'PayMongo Checkout', 
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

// ==========================================
// POST: Generate a PayMongo Session for existing booking
// ==========================================
router.post('/paymongo/checkout', async (req, res) => {
    try {
        const { bookingId, paymentIndex, method, amount } = req.body;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // Encode Auth Header
        const paymongoAuth = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64');

        // --- Build Itemized List ---
        const split = booking.splitBetween || 1;
        const splitText = split > 1 ? ` (Split ${split} ways)` : '';
        const safeInvoice = booking.invoiceDetails || {};
        const items = [];

        // Push individual items if they exist in the invoice
        if (safeInvoice.basePriceTotal > 0) items.push({ name: `Base Price${splitText}`, amount: Math.round((safeInvoice.basePriceTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.accClassTotal > 0) items.push({ name: `${safeInvoice.accClassText || 'Room Upgrade'}${splitText}`, amount: Math.round((safeInvoice.accClassTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.transferTotal > 0) items.push({ name: `Airport Transfer${splitText}`, amount: Math.round((safeInvoice.transferTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.insuranceTotal > 0) items.push({ name: `Travel Insurance${splitText}`, amount: Math.round((safeInvoice.insuranceTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.dinnerTotal > 0) items.push({ name: `Romantic Dinner${splitText}`, amount: Math.round((safeInvoice.dinnerTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.carbonTotal > 0) items.push({ name: `Carbon Offset${splitText}`, amount: Math.round((safeInvoice.carbonTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.vatTotal > 0) items.push({ name: `VAT (12%)${splitText}`, amount: Math.round((safeInvoice.vatTotal / split) * 100), currency: 'PHP', quantity: 1 });

        // Fallback just in case the database didn't have the itemized breakdown
        if (items.length === 0) {
            items.push({ name: `Payment for ${booking.packageName}`, amount: Math.round(amount * 100), currency: 'PHP', quantity: 1 });
        }
        // ---------------------------

        // Create Checkout Session
        const response = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
            data: {
                attributes: {
                    send_email_receipt: true,
                    show_description: true,
                    show_line_items: true,
                    payment_method_types: [method === 'maya' ? 'paymaya' : method], 
                    line_items: items, 
                    success_url: `https://philgood-travels.vercel.app/profile?payment=success`,
                    cancel_url: `https://philgood-travels.vercel.app/checkout`, // ⚡ UPDATED: Now goes back to checkout
                    description: `Booking ID: ${bookingId}`
                }
            }
        }, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: `Basic ${paymongoAuth}`
            }
        });

        res.status(200).json({ checkoutUrl: response.data.data.attributes.checkout_url });

    } catch (error) {
        console.error("PayMongo Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create payment session" });
    }
});

module.exports = router;