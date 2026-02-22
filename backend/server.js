const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables (hidden keys)
dotenv.config();

// Initialize Stripe AFTER dotenv loads so it can read the secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./models/Booking');

// 2. Initialize the Express application
const app = express();

// 3. Set up CORS (Allow frontend to talk to backend)
app.use(cors({
    origin: ['http://localhost:5173', 'https://philgood-travels.vercel.app'], 
    credentials: true
}));

// ==========================================
// ⚡ THE STRIPE WEBHOOK (MUST BE BEFORE express.json) ⚡
// ==========================================
// We use express.raw() here so Stripe can verify the security signature
app.post('/api/bookings/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log("🔔 WEBHOOK CALLED! Signal received from Stripe.");
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify that this request actually came from Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // If a payment was successful...
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const sessionId = session.id; // This looks like cs_test_12345...

        try {
            // 1. Find the booking that has this specific Stripe Session ID in its URL
            const booking = await Booking.findOne({ "payments.paymentUrl": { $regex: sessionId } });
            
            if (booking) {
                // 2. Find the specific friend who paid and update them
                booking.payments.forEach(payment => {
                    if (payment.paymentUrl && payment.paymentUrl.includes(sessionId)) {
                        payment.status = 'Paid';
                        payment.amountPaid = payment.amountDue;
                    }
                });

                // 3. Check if ALL friends have paid
                const allPaid = booking.payments.every(p => p.status === 'Paid');
                if (allPaid) {
                    booking.bookingStatus = 'Confirmed'; // The whole trip is officially booked!
                }

                // 4. Save to database
                await booking.save();
                console.log(`✅ Payment logged successfully for session: ${sessionId}`);
            }
        } catch (error) {
            console.error("❌ Error updating database from webhook:", error);
        }
    }

    // Tell Stripe we received the message so they stop calling
    res.status(200).send();
});


// ==========================================
// 4. Set up Middleware (Translates everything else to JSON)
// ==========================================
app.use(express.json()); 

// 👉 Normal API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));


// ==========================================
// 5. CONNECT TO MONGODB ATLAS
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('PhilGood Travels Backend is running perfectly! 🚀');
});

// 6. Define the Port and Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log(`=================================`);
});