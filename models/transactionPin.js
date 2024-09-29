const mongoose = require('mongoose');

const transactionPinSchema = new mongoose.Schema({
    pin: {
        type: String,
        require: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    wallet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

const TransactionPin = mongoose.model('TransactionPin', transactionPinSchema);
module.exports = TransactionPin;