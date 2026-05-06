const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // e.g., 0.10 for 10%, 0.30 for 30%
    usedBy: [{ type: String }] // ⚡ Tracks every email that has used this code
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);