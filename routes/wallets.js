const express = require('express');

const { createWallet } = require('../controller/wallet');

const walletRoute = express.Router();

walletRoute.post('/walletAccount', (createWallet));

module.exports = walletRoute;