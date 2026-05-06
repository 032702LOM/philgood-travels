const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');
const User = require('../models/User'); 
const PromoCode = require('../models/PromoCode'); // ⚡ NEW: Imported PromoCode Model
const { Resend } = require('resend'); 
const crypto = require('crypto');

// 🛡️ SECURITY: Import the source-of-truth for pricing
const { tourPackages, allPlaces } = require('../data/placesData.js'); 

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚡ AUTO-SEEDER: Creates PALAWAN30 code if it doesn't exist yet
PromoCode.findOne({ code: 'PALAWAN30' }).then(promo => {
    if (!promo) {
        new PromoCode({ code: 'PALAWAN30', discount: 0.30 }).save();
        console.log("Seeded PALAWAN30 promo code.");
    }
});

// ==========================================
// 🛡️ SECURITY HELPER: Server-Side Price Calculation
// ==========================================
const calculateBookingTotal = (bookingData) => {
    const allItems = [...tourPackages, ...allPlaces];
    const item = allItems.find(i => i.id === bookingData.packageId);
    
    if (!item) throw new Error("Invalid Package ID");

    const basePrice = item.price;
    const { adults, children, infants } = bookingData.guests;
    const totalHeads = adults + children + infants;

    // 1. Base Package Calculation (50% Child Discount)
    const adultTotal = basePrice * adults;
    const childTotal = (basePrice * 0.5) * children;
    const packageTotal = adultTotal + childTotal;

    // 2. Accommodation Class Upgrades (50% Child Discount applied)
    const accRates = { Standard: 0, Deluxe: 2500, Luxury: 5000 };
    const selectedRate = accRates[bookingData.accClass] || 0;
    const accTotal = (selectedRate * adults) + (selectedRate * 0.5 * children);

    // 3. Add-ons
    const addonPrices = { airportTransfer: 1500, insurance: 950, romanticDinner: 2500, carbonOffset: 500 };
    let transferTotal = bookingData.addons.airportTransfer ? addonPrices.airportTransfer : 0;
    let insuranceTotal = bookingData.addons.insurance ? (addonPrices.insurance * totalHeads) : 0;
    let dinnerTotal = bookingData.addons.romanticDinner ? addonPrices.romanticDinner : 0;
    let carbonTotal = bookingData.addons.carbonOffset ? (addonPrices.carbonOffset * totalHeads) : 0;

    const subtotal = packageTotal + accTotal + transferTotal + insuranceTotal + dinnerTotal + carbonTotal;
    const vat = subtotal * 0.12;
    const grandTotal = subtotal + vat;

    return {
        grandTotal: Math.round(grandTotal),
        vatTotal: Math.round(vat),
        subtotal: Math.round(subtotal),
        basePriceTotal: Math.round(packageTotal),
        accClassTotal: Math.round(accTotal),
        transferTotal,
        insuranceTotal,
        dinnerTotal,
        carbonTotal,
        packageName: item.name 
    };
};

// ==========================================
// POST: Create a new booking & Send Emails
// ==========================================
router.post('/create', async (req, res) => {
    try {
        // ⚡ UPDATED: Grab appliedPromoCode from the frontend payload
        const { 
            userId, packageId, travelDate, guests, accClass, addons, 
            splitBetween = 1, friendEmails = [], contactInfo, specialRequests,
            appliedPromoCode
        } = req.body;

        const pricing = calculateBookingTotal({ packageId, guests, accClass, addons });
        
        const packageName = pricing.packageName;
        const totalPrice = pricing.grandTotal;
        const amountDue = totalPrice / splitBetween;

        const leadUser = await User.findById(userId);
        const leadName = leadUser ? leadUser.name : "A friend";

        let paymentsArray = [];
        const paymongoAuth = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64');

        const buildPaymongoLineItems = () => {
            const items = [];
            const split = splitBetween || 1;
            const splitText = split > 1 ? ` (Split ${split} ways)` : '';

            if (pricing.basePriceTotal > 0) items.push({ name: `Base Price${splitText}`, amount: Math.round((pricing.basePriceTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (pricing.accClassTotal > 0) items.push({ name: `${accClass} Class Upgrade${splitText}`, amount: Math.round((pricing.accClassTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (pricing.transferTotal > 0) items.push({ name: `Airport Transfer${splitText}`, amount: Math.round((pricing.transferTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (pricing.insuranceTotal > 0) items.push({ name: `Travel Insurance${splitText}`, amount: Math.round((pricing.insuranceTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (pricing.dinnerTotal > 0) items.push({ name: `Romantic Dinner${splitText}`, amount: Math.round((pricing.dinnerTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (pricing.carbonTotal > 0) items.push({ name: `Carbon Offset${splitText}`, amount: Math.round((pricing.carbonTotal / split) * 100), currency: 'PHP', quantity: 1 });
            if (pricing.vatTotal > 0) items.push({ name: `VAT (12%)${splitText}`, amount: Math.round((pricing.vatTotal / split) * 100), currency: 'PHP', quantity: 1 });

            return items;
        };

        const paymongoItems = buildPaymongoLineItems();

        for (let i = 0; i < splitBetween; i++) {
            const payerEmail = friendEmails[i] || leadUser.email;
            
            const paymongoResponse = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
                data: {
                    attributes: {
                        send_email_receipt: true,
                        show_description: true,
                        show_line_items: true,
                        payment_method_types: ['card', 'gcash', 'paymaya'],
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
                stripeSessionId: checkoutId 
            });
            
            const formatPrice = (num) => `₱${Number(num).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

            let itemizedHtml = `<tr><td style="padding: 8px 0; color: #555;">Base Price</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(pricing.basePriceTotal)}</td></tr>`;
            if (pricing.accClassTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">${accClass} Class</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(pricing.accClassTotal)}</td></tr>`;
            if (pricing.transferTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Airport Transfer</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(pricing.transferTotal)}</td></tr>`;
            if (pricing.insuranceTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Travel Insurance</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(pricing.insuranceTotal)}</td></tr>`;
            if (pricing.dinnerTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">Romantic Dinner</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(pricing.dinnerTotal)}</td></tr>`;
            if (pricing.carbonTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #4CAF50;">Carbon Offset</td><td align="right" style="padding: 8px 0; color: #4CAF50; font-weight: bold;">${formatPrice(pricing.carbonTotal)}</td></tr>`;
            if (pricing.vatTotal > 0) itemizedHtml += `<tr><td style="padding: 8px 0; color: #555;">VAT (12%)</td><td align="right" style="padding: 8px 0; color: #333; font-weight: bold;">${formatPrice(pricing.vatTotal)}</td></tr>`;

            const isLead = (payerEmail === leadUser.email);
            const subject = isLead ? `Your Booking for ${packageName} is Pending` : `You've been invited on a trip to ${packageName}!`;
            const introText = isLead 
                ? `You are planning an adventure to <strong style="color: #00B4D8;">${packageName}</strong> on <strong>${travelDate}</strong>!` 
                : `<strong>${leadName}</strong> has invited you on an adventure to <strong style="color: #00B4D8;">${packageName}</strong>!`;

            const htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="text-align: center; color: #003B5C;">PHILGOOD TRAVELS</h2>
                    <p>Hi there!</p>
                    <p>${introText}</p>
                    <div style="border: 1px solid #00B4D8; border-radius: 8px; padding: 20px; background-color: #FAFAFA;">
                        <h3 style="color: #003B5C; margin-top: 0;">Price Summary</h3>
                        <table width="100%">${itemizedHtml}</table>
                        <hr style="border: none; border-top: 1px solid #D0EBEF; margin: 15px 0;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span>Grand Total</span><span style="color: #F69928;">${formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                    <div style="background-color: #003B5C; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px;">
                        <p style="margin: 0;">Your Split Share (${splitBetween} ways):</p>
                        <h1 style="color: #F69928; margin: 5px 0;">${formatPrice(amountDue)}</h1>
                        <a href="${checkoutUrl}" style="background-color: #00B4D8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 10px;">PAY MY SHARE NOW</a>
                    </div>
                </div>`;
            
            try {
                await resend.emails.send({ from: 'PhilGood Travels <onboarding@resend.dev>', to: payerEmail, subject: subject, html: htmlContent });
            } catch (emailErr) {
                console.error("Email Error:", emailErr);
            }
        }

        const newBooking = new Booking({
            userId,
            packageName,
            packageId,
            travelDate,
            guests,
            totalPrice, 
            paymentMethod: 'PayMongo Checkout', 
            splitBetween,
            payments: paymentsArray,
            appliedPromoCode, // ⚡ SAVE THIS SO WEBHOOK KNOWS IT EXISTS
            invoiceDetails: {
                basePriceTotal: pricing.basePriceTotal,
                accClassText: `${accClass} Class`,
                accClassTotal: pricing.accClassTotal,
                transferTotal: pricing.transferTotal,
                insuranceTotal: pricing.insuranceTotal,
                dinnerTotal: pricing.dinnerTotal,
                carbonTotal: pricing.carbonTotal,
                vatTotal: pricing.vatTotal
            },
            contactInfo,
            specialRequests,
            bookingStatus: 'Pending'
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created securely!", booking: newBooking });

    } catch (error) {
        console.error("Booking Error:", error.message);
        res.status(500).json({ error: "Failed to create secure booking." });
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
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        await Booking.deleteMany({
            userId: req.params.userId,
            isArchived: true,
            archivedAt: { $lt: thirtyDaysAgo },
            payments: { $not: { $elemMatch: { status: 'Paid' } } }
        });

        const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings." });
    }
});

// ==========================================
// PUT: Archive a Trip
// ==========================================
router.put('/:id/archive', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { isArchived: true, archivedAt: new Date() }, 
            { returnDocument: 'after' } 
        );
        res.status(200).json({ message: "Trip archived", booking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to archive trip' });
    }
});

// ==========================================
// PUT: Retrieve (Unarchive) a Trip
// ==========================================
router.put('/:id/retrieve', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { isArchived: false, archivedAt: null }, 
            { returnDocument: 'after' } 
        );
        res.status(200).json({ message: "Trip retrieved", booking });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trip' });
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

        const paymongoAuth = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64');

        const split = booking.splitBetween || 1;
        const splitText = split > 1 ? ` (Split ${split} ways)` : '';
        const safeInvoice = booking.invoiceDetails || {};
        const items = [];

        if (safeInvoice.basePriceTotal > 0) items.push({ name: `Base Price${splitText}`, amount: Math.round((safeInvoice.basePriceTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.accClassTotal > 0) items.push({ name: `${safeInvoice.accClassText || 'Room Upgrade'}${splitText}`, amount: Math.round((safeInvoice.accClassTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.transferTotal > 0) items.push({ name: `Airport Transfer${splitText}`, amount: Math.round((safeInvoice.transferTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.insuranceTotal > 0) items.push({ name: `Travel Insurance${splitText}`, amount: Math.round((safeInvoice.insuranceTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.dinnerTotal > 0) items.push({ name: `Romantic Dinner${splitText}`, amount: Math.round((safeInvoice.dinnerTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.carbonTotal > 0) items.push({ name: `Carbon Offset${splitText}`, amount: Math.round((safeInvoice.carbonTotal / split) * 100), currency: 'PHP', quantity: 1 });
        if (safeInvoice.vatTotal > 0) items.push({ name: `VAT (12%)${splitText}`, amount: Math.round((safeInvoice.vatTotal / split) * 100), currency: 'PHP', quantity: 1 });

        if (items.length === 0) {
            items.push({ name: `Payment for ${booking.packageName}`, amount: Math.round(amount * 100), currency: 'PHP', quantity: 1 });
        }

        const response = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
            data: {
                attributes: {
                    send_email_receipt: true,
                    show_description: true,
                    show_line_items: true,
                    payment_method_types: [method === 'maya' ? 'paymaya' : method], 
                    line_items: items, 
                    success_url: `https://philgood-travels.vercel.app/profile?payment=success`,
                    cancel_url: `https://philgood-travels.vercel.app/checkout`,
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

        booking.payments[paymentIndex].stripeSessionId = response.data.data.id;
        booking.payments[paymentIndex].paymentUrl = response.data.data.attributes.checkout_url;
        await booking.save();

        res.status(200).json({ checkoutUrl: response.data.data.attributes.checkout_url });

    } catch (error) {
        console.error("PayMongo Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create payment session" });
    }
});

// ==========================================
// POST: PayMongo Webhook Listener (SECURED)
// ==========================================
router.post('/webhook', async (req, res) => {
    try {
        const signatureHeader = req.headers['paymongo-signature'];
        const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

        if (signatureHeader && webhookSecret && req.rawBody) {
            const parts = signatureHeader.split(',');
            let timestamp, testSignature, liveSignature;

            parts.forEach(part => {
                const [key, value] = part.split('=');
                if (key === 't') timestamp = value;
                if (key === 'te') testSignature = value;
                if (key === 'li') liveSignature = value;
            });

            const expectedSignature = testSignature || liveSignature;
            const payload = timestamp + '.' + req.rawBody;
            const hash = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');

            if (hash !== expectedSignature) {
                console.error("🛑 SEC_ERR: Invalid PayMongo Webhook Signature!");
                return res.status(400).send("Invalid signature");
            }
        } else {
             console.log("⚠️ Warning: Skipping signature verification (Secret key or rawBody missing).");
        }

        const event = req.body;

        if (event?.data?.attributes?.type === 'checkout_session.payment.paid') {
            
            const checkoutId = event.data.attributes.data.id;
            const booking = await Booking.findOne({ "payments.stripeSessionId": checkoutId });

            if (booking) {
                let allPaid = true;

                booking.payments.forEach(payment => {
                    if (payment.stripeSessionId === checkoutId) {
                        payment.status = 'Paid';
                    }
                    if (payment.status !== 'Paid') {
                        allPaid = false; 
                    }
                });

                if (allPaid) {
                    booking.bookingStatus = 'Confirmed';
                    
                    // ⚡ NEW: Once fully paid, permanently log the email so they can't use the promo again
                    if (booking.appliedPromoCode && booking.contactInfo?.email) {
                        await PromoCode.findOneAndUpdate(
                            { code: booking.appliedPromoCode }, 
                            { $push: { usedBy: booking.contactInfo.email.toLowerCase() } }
                        );
                    }
                }

                await booking.save();
                console.log(`✅ Success: Payment securely marked as Paid for Booking ID: ${booking._id}`);

                const user = await User.findById(booking.userId);
                if (user) {
                    user.adminNotes.push({
                        text: `System: Customer successfully made a payment for their trip to ${booking.packageName}.`,
                        authorInitials: '⚙️' 
                    });
                    await user.save();
                }

            } else {
                console.log(`⚠️ Webhook received, but no matching booking found for ID: ${checkoutId}`);
            }
        }

        res.status(200).send('Webhook received successfully');

    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).send("Webhook processing failed");
    }
});

// ⚡ ENHANCED VALIDATION ROUTE
router.post('/validate', async (req, res) => {
    try {
        const { code, email, packageName } = req.body;
        
        if (!email) return res.status(400).json({ error: "Email is required to validate promo codes." });
        
        const promo = await PromoCode.findOne({ code: code.toUpperCase() });
        if (!promo) return res.status(404).json({ error: "Invalid promo code." });

        // 1. Check if this exact email has used it before
        if (promo.usedBy.includes(email.toLowerCase())) {
            return res.status(400).json({ error: "You have already used this promo code." });
        }

        // 2. Specific Logic for PALAWAN30 Code
        if (promo.code === 'PALAWAN30') {
            const isPalawan = ['Palawan', 'El Nido', 'Coron', 'Puerto Princesa'].some(p => packageName.includes(p));
            if (!isPalawan) {
                return res.status(400).json({ error: "PALAWAN30 is only valid for Palawan destinations." });
            }
        }

        res.status(200).json({ valid: true, discount: promo.discount, message: "Promo Code Applied! 🎉" });
    } catch (error) {
        res.status(500).json({ error: "Server error validating code." });
    }
});

module.exports = router;