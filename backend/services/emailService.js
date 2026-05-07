const nodemailer = require('nodemailer');
const dns = require('dns');

const sendEmail = async (options) => {
    try {
        // ⚡ Bypass Nodemailer's IPv6 preference by resolving the IPv4 address ourselves
        const smtpHostIp = await new Promise((resolve, reject) => {
            dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
                if (err) reject("DNS Lookup failed: " + err);
                else resolve(address);
            });
        });

        const transporter = nodemailer.createTransport({
            host: smtpHostIp, // ⚡ Pass the raw IPv4 address we just found
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_SENDER_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            },
            tls: {
                // ⚡ CRITICAL: Tell Google we are looking for 'smtp.gmail.com' so their SSL cert matches our raw IP
                servername: 'smtp.gmail.com' 
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