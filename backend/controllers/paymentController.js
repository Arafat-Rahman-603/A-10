const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const { AppError } = require('../middleware/errorHandler');



exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentAmount = amount || 4999; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: 'usd',
      metadata: {
        user_email: req.user.email
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};



exports.confirmPayment = async (req, res, next) => {
  try {
    const { transaction_id, amount } = req.body;

    
    const existing = await Payment.findOne({ transaction_id });
    if (existing) {
      throw new AppError('Transaction already recorded', 400);
    }

    const payment = await Payment.create({
      user_email: req.user.email,
      amount: amount / 100, 
      transaction_id,
      payment_status: 'succeeded',
      paid_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Payment confirmed and recorded',
      payment
    });
  } catch (error) {
    next(error);
  }
};



exports.getAllTransactions = async (req, res, next) => {
  try {
    const payments = await Payment.find().sort({ paid_at: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    next(error);
  }
};



exports.checkPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      user_email: req.user.email,
      payment_status: 'succeeded'
    });

    res.status(200).json({
      success: true,
      hasPaid: !!payment
    });
  } catch (error) {
    next(error);
  }
};
