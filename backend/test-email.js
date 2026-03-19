require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendTest() {
    console.log(`Attempting to login as: ${process.env.EMAIL_USER}`);
    
    try {
        const info = await transporter.sendMail({
            from: `"PhilGood Travels" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending an email to yourself to test
            subject: "✅ Nodemailer is Working!",
            text: "If you are reading this, your Google App Password is correct and the server can send emails!"
        });
        console.log("SUCCESS! Message sent: %s", info.messageId);
    } catch (error) {
        console.error("FAILED TO SEND EMAIL. Error details:");
        console.error(error);
    }
}

sendTest();