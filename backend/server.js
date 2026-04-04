const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./models/Booking');

// 2. Initialize the Express application
const app = express();

// 3. Set up CORS
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'https://philgood-travels.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// THE STRIPE WEBHOOK
app.post('/api/bookings/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log("🔔 WEBHOOK CALLED! Signal received from Stripe.");
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const sessionId = session.id; 

        try {
            const booking = await Booking.findOne({ "payments.paymentUrl": { $regex: sessionId } });
            
            if (booking) {
                booking.payments.forEach(payment => {
                    if (payment.paymentUrl && payment.paymentUrl.includes(sessionId)) {
                        payment.status = 'Paid';
                        payment.amountPaid = payment.amountDue;
                    }
                });

                const allPaid = booking.payments.every(p => p.status === 'Paid');
                if (allPaid) {
                    booking.bookingStatus = 'Confirmed'; 
                }

                await booking.save();
                console.log(`✅ Payment logged successfully for session: ${sessionId}`);
            }
        } catch (error) {
            console.error("❌ Error updating database from webhook:", error);
        }
    }

    res.status(200).send();
});

// 4. Set up Middleware
app.use(express.json()); 

// 👉 Normal API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));

// ⚡ NEW: Admin Routes
app.use('/api/admin', require('./routes/admin'));

// 5. CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('PhilGood Travels Backend is running perfectly! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
});