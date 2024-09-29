const express = require('express');

const { createDonation, 
    getDonationCount, 
    getSingleDonation, 
    getDonationsByDateRange
} = require('../controller/donation');
const { userAuthenticate } = require('../middleware/authentication');

const donationRoute = express.Router();

donationRoute.post('/donations', userAuthenticate, (createDonation));
donationRoute.get('/donations/getDonationCount/:userId', userAuthenticate, (getDonationCount));
donationRoute.get('/donations/getSingleDonation/:donationId', userAuthenticate, (getSingleDonation));
donationRoute.get('/donations/:startDate/:endDate', userAuthenticate, (getDonationsByDateRange));

module.exports = donationRoute;