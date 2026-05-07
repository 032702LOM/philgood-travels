const nodemailer = require('nodemailer');
const dns = require('dns'); 

// ⚡ THE FIX: Force Node.js to use IPv4 instead of IPv6 to bypass Render's network issue
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_SENDER_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            }
        });

        const mailOptions = {
            from: `"PhilGood Travels" <${process.env.GOOGLE_SENDER_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            replyTo: options.replyTo || process.env.GOOGLE_SENDER_EMAIL
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", options.to);
        return result;
        
    } catch (error) {
        console.error("🚨 Detailed Email Error:", error); 
        throw error;
    }
};

module.exports = sendEmail;