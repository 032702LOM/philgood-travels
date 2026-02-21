const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Ensures no two users can use the same email
    },
    password: { 
        type: String, 
        required: true 
    },
    bookmarks: [{ 
        type: String // We will store the names or IDs of the places they save here
    }]
}, { 
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' dates!
});

module.exports = mongoose.model('User', userSchema);