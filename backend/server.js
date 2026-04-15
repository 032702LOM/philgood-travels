const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const ChatSession = require('./models/ChatSession');

// 1. Load environment variables
dotenv.config();

// Initialize Stripe
const Booking = require('./models/Booking');

// 2. Initialize the Express application
const app = express();

// ⚡ UPGRADE TO HTTP SERVER FOR WEBSOCKETS ⚡
const server = http.createServer(app); // <-- THIS LINE WAS MISSING OR MOVED!

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ['GET', 'POST']
    }
});

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


// 4. Set up Middleware
app.use(express.json()); 

// 👉 Normal API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));

// ⚡ NEW: Admin Routes
app.use('/api/admin', require('./routes/admin'));

// ==========================================
// ⚡ REAL-TIME CHAT SOCKET LOGIC ⚡
// ==========================================
io.on('connection', (socket) => {
    console.log(`🟢 New WebSocket connection: ${socket.id}`);

    // When a user opens the chat widget
    socket.on('join_chat', async (sessionId) => {
        socket.join(sessionId); // Connect them to a private room
        console.log(`User joined room: ${sessionId}`);
    });

    // When a user or admin sends a message
    socket.on('send_message', async (data) => {
        const { sessionId, sender, text } = data;
        
        try {
            // Find or create the chat history in MongoDB
            let chat = await ChatSession.findOne({ sessionId });
            if (!chat) {
                chat = new ChatSession({ sessionId, messages: [] });
            }

            // Save the new message
            const newMessage = { sender, text, timestamp: new Date() };
            chat.messages.push(newMessage);
            
            if (sender === 'user') chat.unreadByAdmin = true;
            
            await chat.save();

            // Broadcast the message to everyone in this specific chat room (the user and the admin)
            io.to(sessionId).emit('receive_message', newMessage);
            
            // Notify the admin dashboard that a new message arrived
            if (sender === 'user') {
                io.emit('admin_notification', { sessionId, text });
            }

        } catch (error) {
            console.error("Socket Message Error:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
    });
});

// 5. CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('PhilGood Travels Backend is running perfectly! 🚀');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
});