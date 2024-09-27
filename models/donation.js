const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recipient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: mongoose.Types.Decimal128, 
        required: true 
    },
    reference: { 
        type: String, 
        required: true, 
        unique: true 
    },
    status: { 
        type: String, 
        default: 'pending' 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
