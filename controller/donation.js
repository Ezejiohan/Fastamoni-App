const asyncWrapper = require('../middleware/async');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { createCustomError } = require('../errors/custom_error');
const { fetchUserById } = require('../repository/user');
const { donationCreate, donationCountDocument, findOneDonation, getTimeRangeForDonations } = require('../repository/donation');
const { fetchWalletById, fetchWalletByIdAndUpdate } = require('../repository/wallet');
const sendMail = require('../utilities/nodemailer');

const createDonation = asyncWrapper(async (req, res, next) => {
  const { donorId, recipientId, donor_wallet_id, recipient_wallet_id, amount, message, pin } = req.body;

  const donor = await fetchUserById(donorId);
  if (!donor) {
    return next(createCustomError('Donor not found', 404));
  }

  const recipient = await fetchUserById(recipientId);
  if (!recipient) {
    return next(createCustomError('Recipient not found', 404));
  }

  let recipientWallet = await fetchWalletById({ _id: recipient_wallet_id });
  let donorWallet = await fetchWalletById({ _id: donor_wallet_id })


  let donorRemainingBalance = (+donorWallet.balance) - (+amount)
  let recipientRemainingBalance = (+recipientWallet.balance) + (+amount)
  console.log(donorRemainingBalance, "Donor", recipientWallet, "My wallet : ", donorWallet)

  try {
    const isMatch = bcrypt.compareSync(pin, donorWallet.pin);
    console.log(isMatch, "Match pin")
  } catch (e) {
    console.log(e, "pin error")
    res.json('Invalid Pin entered')
  }

  await fetchWalletByIdAndUpdate(donor_wallet_id, donorRemainingBalance);

  await fetchWalletByIdAndUpdate(recipient_wallet_id, recipientRemainingBalance);

  const donation = await donationCreate({
    donor: donorId,
    recipient: recipientId,
    donor_wallet_id,
    recipient_wallet_id,
    amount,
    message
  });
  const donationCount = await donationCountDocument(donorId);
  if (donationCount >= 2) {
    const mailOptions = {
      email: donor.email,
      subject: 'Thank You for Your Generous Donations!',
    };
    await sendMail(mailOptions)
  }
  res.status(201).json({
    message: 'Donation created successfully',
    donation
  });

});

const getDonationCount = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  console.log("userId", userId)

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid donor ID');
  }

  const donationCount = await donationCountDocument(userId);

  console.log(donationCount, "Donations")

  if (donationCount === 0) {
    return res.status(200).json({ message: 'No donations made', count: 0 });
  }

  res.status(200).json({
    message: `User has made ${donationCount.length} donation(s)`,
    count: donationCount
  });
});

const getSingleDonation = asyncWrapper(async (req, res, next) => {
  const { donationId } = req.params;

  const donation = await findOneDonation(donationId);

  if (!donation) {
    return next(createCustomError('Donation not found', 404));
  }

  res.status(200).json({
    message: 'Donation fetched successfully',
    donation
  });
});

const getDonationsByDateRange = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body; 
  const { startDate, endDate } = req.params; 
  console.log(startDate, endDate)

  if (!startDate || !endDate) {
    return next(createCustomError('Both startDate and endDate are required', 400));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) {
    return next(createCustomError('Invalid date format', 400));
  }

  try {

    const donations = await getTimeRangeForDonations(userId, start, end)

    if (donations.length === 0) {
      return next(createCustomError('No donations found for the specified period', 404));
    }

    res.status(200).json({
      message: 'Donations fetched successfully',
      donations 
    });
  } catch (error) {
    return next(createCustomError('Server Error', 500)); 
  }
});


module.exports = {
  createDonation,
  getDonationCount,
  getSingleDonation,
  getDonationsByDateRange
};
