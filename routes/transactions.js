const express = require('express');

const { makeTransaction, 
    getAllTransaction, 
    getSingleTransaction, 
    getTransactionsByDateRange} = require('../controller/donation');

const transactionRoute = express.Router();

transactionRoute.post('/transactions', (makeTransaction));
transactionRoute.get('/transactions/getAllTransaction/:userId', (getAllTransaction));
transactionRoute.get('/transactions/getSingleTransaction/:transactionId', (getSingleTransaction));
transactionRoute.get('/transactions/getTransactionsByDateRange', (getTransactionsByDateRange));

module.exports = transactionRoute;