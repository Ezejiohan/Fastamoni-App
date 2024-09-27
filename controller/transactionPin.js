const bcrypt = require('bcrypt');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const { fetchTransactionPin, createPin } = require('../repository/transactionPin');

// Set or Update Transaction PIN Controller
const createTransactionPin = asyncWrapper(async (req, res, next) => {
    const { user_id, account_id, pin } = req.body;

    // Validate pin format (optional)
    if (!/^\d{4,6}$/.test(pin)) {
        return next(createCustomError('PIN must be 4-6 digits', 400));
    }

    // Hash the PIN before saving it
    const salt = bcrypt.genSaltSync(10);
    const hashedPin = bcrypt.hashSync(pin, salt);

    // Check if a transaction pin already exists for this user and account
    const existingPin = await fetchTransactionPin({ user_id, account_id });

    if (existingPin) {
        // Update the existing pin
        existingPin.pin = hashedPin;
        await existingPin.save();
        return res.status(200).json({ message: 'Transaction PIN updated successfully' });
    }

    // Create a new transaction pin
    const newTransactionPin = await createPin({
        user_id,
        account_id,
        pin: hashedPin
    });

    res.status(201).json({
        message: 'Transaction PIN created successfully',
        pin: newTransactionPin
    });
});

module.exports = createTransactionPin;
