const express = require('express');

const createTransactionPin = require('../controller/transactionPin');
const { userAuthenticate } = require('../middleware/authentication');

const transactionPinRoute = express.Router();

transactionPinRoute.post('/createPin', userAuthenticate, (createTransactionPin));

module.exports = transactionPinRoute;
