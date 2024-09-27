const axios = require('axios');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const { fetchUserById } = require('../repository/user');
const { createDonation, findTransaction, findOneTransaction } = require('../repository/donation');

 const createDonation = asyncWrapper(async (req, res) => {
    const { recipient_id, amount } = req.body;
    const donor_id = req.user.id; // Assuming user authentication has been implemented
      // Step 1: Create a reference for the donation
      const reference = `donation_${Date.now()}`;
  
      // Step 2: Initialize the Paystack payment
      const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email: req.user.email, // The email of the donor
        amount: amount * 100,  // Amount in kobo (convert to smallest unit)
        reference: reference,  // Unique transaction reference
        metadata: {
          donor_id,
          recipient_id,
        },
        callback_url: 'https://your-app.com/paystack/callback', // Paystack will redirect after payment
      }, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        }
      });
  
      // Step 3: Save donation details to the database (optional)
      await createDonation({
        donor_id,
        recipient_id,
        amount,
        reference,
        status: 'pending', // Initially set status to pending
      });
  
      // Step 4: Return the authorization URL so the user can make the payment
      res.status(200).json({
        paymentLink: response.data.data.authorization_url,
        message: 'Payment link created successfully',
      });
});

const getAllTransaction = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;

    // Find all donations made by the user
    const transaction = await fetchUserById(userId);

    res.status(200).json({
        status: "Success",
        numbersOfTransaction: transaction.length,
        data: transaction
    });
});

const getSingleTransaction = asyncWrapper(async (req, res, next) => {
    const { transactionId } = req.params;
    const { userId } = req.body;  

    const transaction = await findOneTransaction({ _id: transactionId, userId }).populate('recipient', 'firstname lastname email');

    if (!transaction) {
        return next(createCustomError('Transaction not found', 404));
    }

    res.status(200).json({
        message: 'Transaction fetched successfully',
        transaction
    });
});

const getTransactionsByDateRange = asyncWrapper(async (req, res, next) => {
    const { userId } = req.body;  // Assuming userId is sent from the request body or can be retrieved from authentication
    const { startDate, endDate } = req.query;  // Get the date range from query parameters

    // Validate date inputs
    if (!startDate || !endDate) {
        return next(createCustomError('Both startDate and endDate are required', 400));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
        return next(createCustomError('Invalid date format', 400));
    }

    // Fetch all transactions within the date range for the specific user (sender)
    const transactions = await findTransaction({
        userId,
        date: {
            $gte: start,
            $lte: end
        }
    }).populate('recipient', 'firstname lastname email');

    // If no transactions are found, return a 404
    if (transactions.length === 0) {
        return next(createCustomError('No transactions found for the specified period', 404));
    }

    // Return the found transactions
    res.status(200).json({
        message: 'Transactions fetched successfully',
        transactions
    });
});

module.exports = {
    createDonation,
    getAllTransaction,
    getSingleTransaction,
    getTransactionsByDateRange
};
