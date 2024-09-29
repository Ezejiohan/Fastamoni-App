const TransactionPin = require('../models/transactionPin');

exports.createPin = (options) => {
    return TransactionPin.create(options)
};
