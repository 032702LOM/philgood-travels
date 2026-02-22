const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // We link the booking to the specific User's ID (The Lead Booker)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // The details of the trip
    packageName: { type: String, required: true },
    travelDate: { type: String, required: true },
    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 }
    },
    
    // --- UPDATED PAYMENT TRACKING ---
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    
    // ⚡ THE FIX: Added 'Postponed' to the VIP list ⚡
    bookingStatus: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Postponed'], 
        default: 'Pending' 
    },
    
    // How many ways are we splitting the bill?
    splitBetween: {
        type: Number,
        default: 1
    },
    
    // A list of individual invoices for the group
    payments: [
        {
            payerEmail: { type: String, required: true }, // Friend's email
            amountDue: { type: Number, required: true },  // Their share
            amountPaid: { type: Number, default: 0 },     // How much they've paid so far
            status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
            paymentUrl: { type: String } // The unique Stripe link for this specific friend
        }
    ]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);