const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const Message = require('../models/Message'); // ⚡ NEW: Import the Message model

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // ⚡ NEW: Save the message to MongoDB first!
        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();

        // Then send the email via Resend
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