const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

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

        // Notify Admin of Payment Success
        try {
          await Notification.create({
            type: 'NEW_ORDER',
            title: 'Payment Confirmed',
            message: `Payment verified for Order #${db_order_id}. Total: ₹${order.totalPrice}`,
            orderId: db_order_id
          });

          await sendEmail({
            email: process.env.EMAIL_USER,
            subject: `Payment Verified - Order #${db_order_id}`,
            message: `Payment has been successfully verified for Order #${db_order_id}.\nAmount Paid: ₹${order.totalPrice}\nPayment ID: ${razorpay_payment_id}`,
            html: `
              <h1>Payment Confirmation</h1>
              <p>Payment has been verified for an order on DigiMart.</p>
              <ul>
                <li><strong>Order ID:</strong> ${db_order_id}</li>
                <li><strong>Amount Paid:</strong> ₹${order.totalPrice}</li>
                <li><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</li>
              </ul>
            `
          });
        } catch (err) {
          console.error('Admin alert failed after payment:', err);
        }

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
