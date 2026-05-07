const { google } = require('googleapis');

const sendEmail = async (options) => {
    try {
        // 1. Authenticate using standard web protocols (bypasses SMTP firewalls)
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // 2. Safely encode the subject line to handle emojis/special characters
        const utf8Subject = `=?utf-8?B?${Buffer.from(options.subject).toString('base64')}?=`;
        
        // 3. Build the email format
        const messageParts = [
            `From: "PhilGood Travels" <${process.env.GOOGLE_SENDER_EMAIL}>`,
            `To: ${options.to}`,
            `Reply-To: ${options.replyTo || process.env.GOOGLE_SENDER_EMAIL}`,
            `Subject: ${utf8Subject}`,
            `Content-Type: text/html; charset=utf-8`,
            `MIME-Version: 1.0`,
            ``,
            options.html
        ];

        const message = messageParts.join('\n');

        // 4. Gmail API requires the email to be base64url encoded
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // 5. Send the email using the HTTP REST API (Port 443 - NEVER BLOCKED)
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });

        console.log("✅ Email sent successfully via Gmail API to:", options.to);
        return result.data;
        
    } catch (error) {
        console.error("🚨 Detailed Gmail API Error:", error.message || error); 
        throw error;
    }
};

module.exports = sendEmail;