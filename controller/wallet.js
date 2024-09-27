const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const { fetchWallet, walletCreated } = require('../repository/wallet');

// Function to generate a random account number
const generateAccountNumber = () => {
    // A simple example of generating a 10-digit account number
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Create Wallet Controller
const createWallet = asyncWrapper(async (req, res, next) => {
    const { user_id, type } = req.body;

    // Ensure the user_id is provided
    if (!user_id) {
        return next(createCustomError('User ID is required', 400));
    }

    // Generate unique account number
    let account_number = generateAccountNumber();

    // Ensure that the account number is unique
    let accountExists = await fetchWallet({ account_number });
    while (accountExists) {
        account_number = generateAccountNumber();
        accountExists = await fetchWallet({ account_number });
    }

    // Create the account
    const newWallet = await walletCreated({
        user_id,
        account_number,
        type,
        balance: 0.00, // Initial balance
        status: 'active', // Default status is active
    });
    await newWallet.save();

    // Send a success response
    res.status(201).json({
        message: 'Wallet created successfully',
        newWallet
    });
});

module.exports = { createWallet };
