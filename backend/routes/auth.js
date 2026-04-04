const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

// POST Route to REGISTER a new secure user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use!" });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json({ message: "✅ Secure user created successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Failed to create user", details: error.message });
    }
});

// POST Route to LOGIN an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.status(200).json({
            message: "✅ Login successful!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin // ⚡ NEW: Admin flag
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Login failed", details: error.message });
    }
});

module.exports = router;