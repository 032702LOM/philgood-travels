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
    
    // ⚡ NEW: Stores the exact price breakdown for the invoice email ⚡
    invoiceDetails: {
        basePriceTotal: { type: Number, default: 0 },
        accClassText: { type: String, default: '' },
        accClassTotal: { type: Number, default: 0 },
        transferTotal: { type: Number, default: 0 },
        insuranceTotal: { type: Number, default: 0 },
        dinnerTotal: { type: Number, default: 0 },
        carbonTotal: { type: Number, default: 0 },
        vatTotal: { type: Number, default: 0 }
    },

    bookingStatus: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Postponed'], 
        default: 'Pending' 
    },
    
    postponeCount: { type: Number, default: 0 }, 
    cancelledAt: { type: Date }, 

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