const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const { fetchWallet, walletCreated, fetchWalletById } = require('../repository/wallet');

const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const createWallet = asyncWrapper(async (req, res, next) => {
    const { user_id, type } = req.body;

    if (!user_id) {
        return next(createCustomError('User ID is required', 400));
    };

    let account_number = generateAccountNumber();

    let walletExists = await fetchWallet({ account_number });
    while (walletExists) {
        account_number = generateAccountNumber();
        accountExists = await fetchWallet({ account_number });
    };

    const newWallet = await walletCreated({
        user_id,
        account_number,
        type,
        balance: 0.00,
        status: 'active'
    });
    await newWallet.save();

    res.status(201).json({
        message: 'Wallet created successfully',
        newWallet
    });
});

const getWallet = asyncWrapper(async (req, res, next) => {
    const { walletId } = req.params;
    const wallet = await fetchWalletById(walletId)
    if (!wallet) {
        return next(createCustomError('Wallet no found', 404))
    }
    res.status(200).json({
        message: "Wallet found successful",
        wallet
    })
})

module.exports = { createWallet, getWallet };

