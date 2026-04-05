const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const Message = require('../models/Message');
const Subscriber = require('../models/Subscriber'); // ⚡ Imported our new model

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚡ NEW: Route to handle Newsletter Subscriptions ⚡
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required." });

        // Check if they are already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) return res.status(400).json({ error: "This email is already subscribed!" });

        // Save the new email
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(200).json({ message: "Successfully subscribed to the newsletter!" });
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

        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', 
            to: 'techtacoder@gmail.com', 
            reply_to: email, 
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