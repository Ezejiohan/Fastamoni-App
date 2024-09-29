const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donor_wallet_id: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: 'Wallet'
    },
    recipient_wallet_id: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: 'Wallet'
    },
    amount: {
        type: mongoose.Types.Decimal128,
        default: 0.0,
        required: true
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
