const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // We link the booking to the specific User's ID!
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // The details of the trip
    packageName: { type: String, required: true },
    travelDate: { type: String, required: true },
    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 }
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);