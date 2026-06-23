const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: [true, 'User email is required'],
    lowercase: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  transaction_id: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true
  },
  payment_status: {
    type: String,
    enum: ['succeeded', 'pending', 'failed'],
    default: 'pending'
  },
  paid_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
