const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const { AppError } = require('../middleware/errorHandler');



exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentAmount = amount || 2500; 

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



exports.createCheckoutSession = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'StartupForge Premium',
            description: 'Unlock unlimited opportunity postings',
          },
          unit_amount: 2500,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/founder/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/founder`,
      customer_email: req.user.email,
      metadata: {
        user_email: req.user.email,
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};



exports.verifyCheckoutSession = async (req, res, next) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      throw new AppError('Session ID is required', 400);
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const existing = await Payment.findOne({ transaction_id: session.payment_intent });

      if (!existing) {
        await Payment.create({
          user_email: req.user.email,
          amount: session.amount_total / 100,
          transaction_id: session.payment_intent,
          payment_status: 'succeeded',
          paid_at: new Date(),
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified and recorded',
        hasPaid: true,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        hasPaid: false,
      });
    }
  } catch (error) {
    
  }
};
