const express = require('express');

const createTransactionPin = require('../controller/transactionPin');

const transactionPinRoute = express.Router();

transactionPinRoute.post('/createPin', (createTransactionPin));

module.exports = transactionPinRoute;
