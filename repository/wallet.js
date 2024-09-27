const Wallet = require('../models/wallet');

exports.fetchWallet = async (options) => {
    return await Wallet.findOne(options)
}

exports.walletCreated = async (options) => {
    return await Wallet.create(options)
}
