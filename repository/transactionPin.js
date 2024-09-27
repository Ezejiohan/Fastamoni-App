const TransactionPin = require('../models/transactionPin');

exports.fetchTransactionPin = (options) => {
    return TransactionPin.findOne(options)
};

exports.createPin = (options) => {
    return TransactionPin.create(options)
};
