const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const crypto = require('crypto'); 
const Message = require('../models/Message');
const Subscriber = require('../models/Subscriber');
const User = require('../models/User');
const PromoCode = require('../models/PromoCode'); // ⚡ NEW: Imported PromoCode Model
const sendEmail = require('../services/emailService');


router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required." });

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) return res.status(400).json({ error: "This email is already subscribed!" });

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        const uniqueCode = 'WELCOME-' + crypto.randomBytes(3).toString('hex').toUpperCase();

        // ⚡ NEW: Save the generated code directly to the PromoCode collection!
        await new PromoCode({ code: uniqueCode, discount: 0.10 }).save();

        const user = await User.findOne({ email });
        if (user) {
            user.marketing = {
                ...user.marketing,
                email: true
            };
            user.adminNotes.push({ 
                text: `System: User subscribed to newsletter and was sent the 10% off code (${uniqueCode}).`, 
                authorInitials: '⚙️' 
            });
            await user.save();
        }

        await sendEmail({
            to: email,
            subject: 'Welcome to PhilGood Travels! Here is your 10% OFF code 🎉',
            html:`
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; text-align: center; padding: 20px;">
                    <h2 style="color: #003B5C;">Welcome to the PhilGood Family!</h2>
                    <p>Thank you for subscribing to our newsletter. You're now on the list for exclusive travel deals, hidden gem destinations, and island inspiration.</p>
                    <p>As a thank you, enjoy <strong>10% OFF</strong> your first booking with us!</p>
                    
                    <div style="background-color: #F4FAFC; padding: 20px; margin: 30px auto; border: 2px dashed #00B4D8; border-radius: 8px; display: inline-block;">
                        <span style="font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #F69928;">
                            ${uniqueCode}
                        </span>
                    </div>
                    
                    <p>Simply provide this code to our team when securing your spot.</p>
                    <a href="https://philgood-travels.vercel.app/tours" style="background-color: #00B4D8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 20px;">EXPLORE TOURS NOW</a>
                </div>
            `
        });

        res.status(200).json({ message: "Subscribed successfully! Check your email for your 10% discount code." });
    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ error: "Failed to process subscription." });
    }
});

// Original Contact Form Route
router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();

       await sendEmail({
            to: 'techtacoder@gmail.com', // Your main contact hub
            replyTo: email, // This lets you click "Reply" in Gmail to email the user directly
            subject: `New Message: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `
        });

        res.status(200).json({ message: "Message saved and email sent successfully!" });
    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ error: "Failed to send message." });
    }
});

module.exports = router;