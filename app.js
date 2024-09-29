const express = require('express');
const route = require('./routes/users');
const walletRoute = require('./routes/wallets')
const transactionPinRoute = require('./routes/transactionPins');
const donationRoute = require('./routes/donations');
const app = express();

const {notFound} = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', route);
app.use('/', walletRoute);
app.use('/', transactionPinRoute);
app.use('/', donationRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);

module.exports = app;
