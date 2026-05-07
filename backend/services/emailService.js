const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    try {
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) reject("Failed to create access token :(");
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_USER,
                accessToken,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN
            }
        });

        return transporter;
    } catch (error) {
        console.error("Transporter Error:", error);
        return null;
    }
};

const sendEmail = async (options) => {
    try {
        const emailTransporter = await createTransporter();
        if (!emailTransporter) throw new Error("Could not create transporter");

        const mailOptions = {
            from: `"PhilGood Travels" <${process.env.GMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            replyTo: options.replyTo || process.env.GMAIL_USER
        };

        const result = await emailTransporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("SendEmail Error:", error);
        throw error;
    }
};

module.exports = sendEmail;