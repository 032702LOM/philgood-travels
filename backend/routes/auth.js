const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // 👈 Encryption tool
const jwt = require('jsonwebtoken'); // 👈 VIP Wristband maker
const User = require('../models/User'); 

// ==========================================
// POST Route to REGISTER a new secure user
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if the email is already taken!
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use!" });
        }

        // 2. ENCRYPT THE PASSWORD
        // Generate a "salt" (random extra characters)
        const salt = await bcrypt.genSalt(10); 
        // Mix the password and the salt, then scramble it!
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user with the SCRAMBLED password
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword // 👈 Save the secure version!
        });

        // 4. Save to database
        await newUser.save();

        res.status(201).json({ message: "✅ Secure user created successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Failed to create user", details: error.message });
    }
});

// ==========================================
// POST Route to LOGIN an existing user
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // 2. Compare the typed password with the scrambled database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // 3. Create the "VIP Wristband" (JWT)
        const token = jwt.sign(
            { id: user._id }, // Payload (data inside the token)
            process.env.JWT_SECRET, // Your secret signature
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send the token and basic user info back to the frontend
        res.status(200).json({
            message: "✅ Login successful!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Login failed", details: error.message });
    }
});

module.exports = router;