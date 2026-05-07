const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 
const User = require('../models/User'); 
const Subscriber = require('../models/Subscriber');
const PromoCode = require('../models/PromoCode');
const sendEmail = require('../services/emailService');

// POST Route to REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, optInNewsletter } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use!" });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        let isSubscribed = false;
        let adminNotes = [{ text: `System: Customer account created for ${name}. Pending email verification.`, authorInitials: '⚙️' }];

        const existingSubscription = await Subscriber.findOne({ email: email });
        
        if (existingSubscription) {
            isSubscribed = true;
        } else if (optInNewsletter) {
            const newSubscriber = new Subscriber({ email });
            await newSubscriber.save();
            isSubscribed = true;
            
            const uniqueCode = 'WELCOME-' + crypto.randomBytes(3).toString('hex').toUpperCase();
            
            // ⚡ NEW: Save the generated code directly to the PromoCode collection!
            await new PromoCode({ code: uniqueCode, discount: 0.10 }).save();
            
            adminNotes.push({ text: `System: User subscribed to newsletter during sign-up and was sent the 10% off code (${uniqueCode}).`, authorInitials: '⚙️' });

            await sendEmail({
        to: email,
        subject: 'Welcome to PhilGood Travels! Here is your 10% OFF code 🎉',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; text-align: center; padding: 20px;">
                <h2 style="color: #003B5C;">Welcome to the PhilGood Family!</h2>
                <p>As a thank you, enjoy <strong>10% OFF</strong> your first booking with us!</p>
                <div style="background-color: #F4FAFC; padding: 20px; margin: 30px auto; border: 2px dashed #00B4D8; border-radius: 8px; display: inline-block;">
                    <span style="font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #F69928;">
                        ${uniqueCode}
                    </span>
                </div>
                <p>Simply provide this code to our team when securing your spot.</p>
            </div>
        `
    });
}

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            isVerified: false, 
            verificationToken: verificationToken, 
            marketing: {
                email: isSubscribed,
                sms: false
            },
            adminNotes: adminNotes
        });

        await newUser.save();

        const verificationLink = `https://philgood-travels.vercel.app/verify-email?token=${verificationToken}`;

        await sendEmail({
    to: email, 
    subject: 'Verify your email - PhilGood Travels',
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #003B5C;">Welcome to PhilGood Travels, ${name}!</h2>
            <p>Please verify your email address to activate your account.</p>
            <a href="${verificationLink}" style="background-color: #00B4D8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">VERIFY MY EMAIL</a>
        </div>
    `
});

        res.status(201).json({ message: "Registration successful! Please check your email to verify your account." });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// POST Route to VERIFY EMAIL
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired verification token." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        
        user.adminNotes.push({
            text: `System: Customer successfully verified their email address.`,
            authorInitials: '⚙️'
        });

        await user.save();
        res.status(200).json({ message: "✅ Email verified successfully! You can now log in." });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: "Failed to verify email." });
    }
});

// POST Route to LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET,                  
            { expiresIn: '7d' }                      
        );

        res.cookie('token', token, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'none', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login." });
    }
});

// POST Route to FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "If that email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.adminNotes.push({
            text: `System: Customer requested a password reset.`,
            authorInitials: '⚙️'
        });

        await user.save();

        const resetLink = `https://philgood-travels.vercel.app/reset-password?token=${resetToken}`;

        await sendEmail({
    to: email,
    subject: 'Password Reset Request - PhilGood Travels',
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #003B5C;">Password Reset Request</h2>
            <p>Click the button below to set a new password. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="background-color: #F69928; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 20px;">RESET PASSWORD</a>
        </div>
    `
});

        res.status(200).json({ message: "If that email exists, a reset link has been sent." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Server error while processing request." });
    }
});

// POST Route to RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
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

// POST Route to LOGOUT
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
});

const { verifyToken } = require('../middleware/authMiddleware');

// GET Route to check if user is logged in
router.get('/me', verifyToken, async (req, res) => {
    try {
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