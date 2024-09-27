const Donation = require('../models/donation');

exports.createDonation = (options) => {
    return Donation.create(options)
};

exports.findOneTransaction = (options) => {
    return Transaction.findOne(options)
}

exports.findTransaction = (options) => {
    return Transaction.find(options)
}
