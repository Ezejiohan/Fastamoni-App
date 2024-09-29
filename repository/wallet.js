const Wallet = require('../models/wallet');

exports.fetchWallet = async (options) => {
    return await Wallet.findOne(options)
}

exports.walletCreated = async (options) => {
    return await Wallet.create(options)
}

exports.fetchWalletById = async (options) => {
    return await Wallet.findById(options)
}

exports.fetchWalletByIdAndUpdate = async (walletId, newBalance) => {
    try {
        const updatedWallet = await Wallet.findByIdAndUpdate(
            {_id : walletId},              
            { balance: newBalance }, 
            { new: true, runValidators: true } 
        );
        
        if (!updatedWallet) {
            console.log('Wallet not found');
            return null;
        }

        console.log('Updated Wallet:', updatedWallet);
        return updatedWallet;
    } catch (error) {
        console.error('Error updating wallet:', error);
        return null;
    }

}

exports.fetchWalletByIdAndUpdatePin = async (walletId, pin) => {
    try {
        const updatedWallet = await Wallet.findByIdAndUpdate(
            {_id : walletId},
            { pin: pin }, 
            { new: true, runValidators: true }
        );
        
        if (!updatedWallet) {
            console.log('Wallet not found');
            return null;
        }

        console.log('Updated pin:', updatedWallet);
        return updatedWallet;
    } catch (error) {
        console.error('Error updating pin:', error);
        return null;
    }

}
