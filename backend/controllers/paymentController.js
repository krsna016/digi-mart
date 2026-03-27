const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payment/order
// @access  Private
const createPaymentOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const amountInPaise = Math.round(amount * 100);
    
    if (amountInPaise < 100) {
      return res.status(400).json({ message: 'Minimum transaction amount is ₹1.00' });
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Error creating Razorpay order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    db_order_id,
  } = req.body;

  try {
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      // Payment is verified
      const order = await Order.findById(db_order_id);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
          update_time: Date.now().toString(),
        };

        const updatedOrder = await order.save();
        res.json({ status: 'ok', order: updatedOrder });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(400).json({ status: 'verification_failed' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
