const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    packageName: { type: String, required: true },
    travelDate: { type: String, required: true },
    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 }
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    bookingStatus: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Postponed'], 
        default: 'Pending' 
    },
    
    // ⚡ NEW: Tracking limits for modifications ⚡
    postponeCount: { type: Number, default: 0 }, // Stops at 2
    cancelledAt: { type: Date }, // Remembers when it was cancelled

    splitBetween: { type: Number, default: 1 },
    payments: [
        {
            payerEmail: { type: String, required: true },
            amountDue: { type: Number, required: true }, 
            amountPaid: { type: Number, default: 0 },    
            status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
            paymentUrl: { type: String }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);