const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const { Resend } = require('resend'); 
const User = require('../models/User'); 
const Subscriber = require('../models/Subscriber');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST Route to REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use!" });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingSubscription = await Subscriber.findOne({ email: email });

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            isVerified: false, 
            verificationToken: verificationToken, 
            marketing: {
                email: !!existingSubscription,
                sms: false
            },
            adminNotes: [{
                text: `System: Customer account created for ${name}. Pending email verification.`,
                authorInitials: '⚙️'
            }]
        });

        await newUser.save();

        const verificationUrl = `https://philgood-travels.vercel.app/verify-email?token=${verificationToken}`;
        
        await resend.emails.send({
            from: 'PhilGood Travels <onboarding@resend.dev>', 
            to: email, 
            subject: 'Verify Your PhilGood Travels Account',
            html: `
                <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h2 style="color: #00B4D8;">Welcome to PhilGood Travels, ${name}!</h2>
                    <p>Please verify your email address to activate your account and start booking trips.</p>
                    <a href="${verificationUrl}" style="display: inline-block; background-color: #FF9F1C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Verify My Email</a>
                </div>
            `
        });

        res.status(201).json({ message: "✅ Account created! Please check your email to verify your account." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "❌ Failed to create user", details: error.message });
    }
});

// POST Route to VERIFY the email token
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired verification link." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        
        user.adminNotes.push({
            text: `System: Email address successfully verified.`,
            authorInitials: '⚙️'
        });

        await user.save();

        res.status(200).json({ message: "✅ Email verified successfully! You can now log in." });
    } catch (error) {
        res.status(500).json({ error: "❌ Verification failed", details: error.message });
    }
});

// POST Route to LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email address before logging in." });
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

        // ⚡ NEW: Bake the token directly into an HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true, // Invisible to frontend JavaScript
            secure: true, // Required for cross-origin cookies (Vercel -> Render)
            sameSite: 'none', // Allows the cookie to be sent across different domains
            maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
        });

        res.status(200).json({
            message: "✅ Login successful!",
            // ⚡ Notice: We no longer send the token back in the JSON body!
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
        });

    } catch (error) {
        res.status(500).json({ error: "❌ Login failed", details: error.message });
    }
});

// POST Route to handle "Forgot Password" request
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        const resetUrl = `https://philgood-travels.vercel.app/reset-password/${resetToken}`;

        await resend.emails.send({
            from: 'PhilGood Travels <onboarding@resend.dev>', 
            to: user.email, 
            subject: 'Password Reset Request - PhilGood Travels',
            html: `
                <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h2 style="color: #00B4D8;">Password Reset</h2>
                    <p>You requested to reset your password. Click the button below to create a new one.</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #FF9F1C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Reset Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
                </div>
            `
        });

        res.status(200).json({ message: "If that email is registered, a reset link has been sent." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Failed to process request." });
    }
});

// POST Route to actually SAVE the new password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ error: "Password reset token is invalid or has expired." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        user.adminNotes.push({
            text: `System: Customer successfully reset their password.`,
            authorInitials: '⚙️'
        });

        await user.save();

        res.status(200).json({ message: "✅ Password has been successfully reset! You can now log in." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Failed to reset password." });
    }
});

// ⚡ NEW: POST Route to LOGOUT and destroy the cookie
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0) // Sets expiration to the past, forcing the browser to delete it
    });
    res.status(200).json({ message: "Logged out successfully" });
});

const { verifyToken } = require('../middleware/authMiddleware'); // ⚡ Import your middleware

// GET Route to check if user is logged in (Persistence)
router.get('/me', verifyToken, async (req, res) => {
    try {
        // Find the user by the ID we extracted from the secure cookie
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;