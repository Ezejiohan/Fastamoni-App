const bcrypt = require('bcrypt');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const { createPin } = require('../repository/transactionPin');
const { fetchWalletById, fetchWalletByIdAndUpdatePin } = require("../repository/wallet");

const createTransactionPin = asyncWrapper(async (req, res, next) => {
    const { user_id, wallet_id, pin } = req.body;
    if (!/^\d{4,6}$/.test(pin)) {
        return next(createCustomError('PIN must be 4-6 digits', 400));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPin = bcrypt.hashSync(pin, salt);

    let wallet = await fetchWalletById({ _id: wallet_id });

    await fetchWalletByIdAndUpdatePin(wallet._id, hashedPin)

    const newTransactionPin = await createPin({
        user_id,
        wallet_id,
        pin: hashedPin
    });

    res.status(201).json({
        message: 'Transaction PIN created successfully',
        pin: newTransactionPin
    });
});

module.exports = createTransactionPin;
