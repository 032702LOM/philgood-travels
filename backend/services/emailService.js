const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_SENDER_EMAIL,       // ⚡ FIXED PREFIX
                clientId: process.env.GOOGLE_CLIENT_ID,      // ⚡ FIXED PREFIX
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // ⚡ FIXED PREFIX
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN  // ⚡ FIXED PREFIX
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