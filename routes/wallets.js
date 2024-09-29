const express = require('express');

const { createWallet } = require('../controller/wallet');
const { userAuthenticate } = require('../middleware/authentication');

const walletRoute = express.Router();

walletRoute.post('/wallets', userAuthenticate, (createWallet));


module.exports = walletRoute;