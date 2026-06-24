const express = require('express');
const router = express.Router();
const {
  createPaymentIntent, confirmPayment,
  getAllTransactions, checkPaymentStatus,
  createCheckoutSession, verifyCheckoutSession
} = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.post('/create-payment-intent', auth, authorize('founder'), createPaymentIntent);
router.post('/create-checkout-session', auth, authorize('founder'), createCheckoutSession);
router.get('/verify-session', auth, authorize('founder'), verifyCheckoutSession);
router.post('/confirm', auth, authorize('founder'), confirmPayment);
router.get('/', auth, authorize('admin'), getAllTransactions);
router.get('/check', auth, authorize('founder'), checkPaymentStatus);

module.exports = router;
