const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: mongoose.Types.Decimal128,
        required: true,
        default: 0.00
    },
    type: {
        type: String,
        enum: ['savings', 'fixed', 'current'],
        default: 'savings'
    },
    status: {
        type: String,
        enum: ['active', 'frozen', 'deleted' ],
        default: 'active'
    },
    pin: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    tableName: 'wallets',
    underscored: true
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
