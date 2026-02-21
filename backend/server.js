const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables (hidden keys)
dotenv.config();

// 2. Initialize the Express application
const app = express();

// 3. Set up Middleware
app.use(cors()); 
app.use(express.json()); 

// 👉 THIS IS THE CRITICAL LINE FOR YOUR ROUTE:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

// ==========================================
// 4. CONNECT TO MONGODB ATLAS
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 5. Create a basic Test Route
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