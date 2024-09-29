const Donation = require('../models/donation');

exports.donationCreate = (options) => {
    return Donation.create(options)
};

exports.findOneDonation = (id) => {
    return Donation.findById(id); 
}

exports.donationCountDocument = (donorId) => {
    const donations = Donation.find({ donor: donorId }).exec();
    return donations
}

exports.getTimeRangeForDonations = async (userId, start, end) => {
    try {
        const donations = await Donation.find({
            donor: userId, 
            createdAt: {
                $gte: start, 
                $lte: end 
            }
        });

        console.log(donations, 'donations');

        return donations;
    } catch (err) {
        console.error('Error fetching donations:', err);
        throw err; 
    }
};
