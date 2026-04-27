const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Layer 1: Verify if the user is logged in via secure cookie
 */
const verifyToken = async (req, res, next) => {
    // Look for the 'token' inside the cookies sent by the browser
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Access denied. Please log in." });
    }

    try {
        // Decrypt the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user ID to the request object for the next function to use
        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(403).json({ error: "Session expired or invalid token. Please log in again." });
    }
};

/**
 * Layer 2: Verify if the logged-in user is actually an Admin
 */
const isAdmin = async (req, res, next) => {
    try {
        // Use the ID we attached in verifyToken to find the user in the DB
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: "Restricted access. Admin privileges required." });
        }

        // If they are an admin, proceed to the route!
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error during authorization." });
    }
};

module.exports = { verifyToken, isAdmin };