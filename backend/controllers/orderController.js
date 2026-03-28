const Order = require('../models/Order');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Create Admin Notification & Email (Non-blocking)
    const notifyAdmin = async () => {
      try {
        await Notification.create({
          type: 'NEW_ORDER',
          title: 'New Order Received',
          message: `Order #${createdOrder._id} for ₹${createdOrder.totalPrice} has been placed.`,
          orderId: createdOrder._id
        });
        
        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
        let dashboardUrl = process.env.FRONTEND_URL;
        if (isProduction && (!dashboardUrl || dashboardUrl.includes('localhost'))) {
          dashboardUrl = 'https://digi-mart-uppt.vercel.app';
        } else if (!dashboardUrl) {
          dashboardUrl = 'http://localhost:3000';
        }

        await sendEmail({
          email: process.env.EMAIL_USER,
          subject: `New Order Received - DigiMart #${createdOrder._id}`,
          message: `A new order has been placed.\nOrder ID: ${createdOrder._id}\nTotal: ₹${createdOrder.totalPrice}\nCustomer: ${req.user.name} (${req.user.email})`,
          html: `
            <h1>New Order Alert</h1>
            <p>A new order has been placed on DigiMart.</p>
            <ul>
              <li><strong>Order ID:</strong> ${createdOrder._id}</li>
              <li><strong>Total Amount:</strong> ₹${createdOrder.totalPrice}</li>
              <li><strong>Customer:</strong> ${req.user.name} (${req.user.email})</li>
            </ul>
            <p><a href="${dashboardUrl}/admin/orders/${createdOrder._id}" style="background: #1C1917; color: white; padding: 10px 20px; text-decoration: none; border-radius: 30px; display: inline-block;">View Order in Dashboard</a></p>
          `
        });
        console.log('[Background] Admin notified of new order');
      } catch (err) {
        console.error('[Background] Failed to notify admin:', err.message);
      }
    };

    // Trigger notification in background
    notifyAdmin();

    // OPTIMIZATION: If payment method is Razorpay, create the payment order immediately
    // to save the frontend from making another round-trip.
    if (paymentMethod === 'Razorpay') {
      try {
        const amountInPaise = Math.round(createdOrder.totalPrice * 100);
        const options = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: createdOrder._id.toString(),
        };

        const razorpayOrder = await razorpay.orders.create(options);
        
        // Return both the DB order and the Razorpay order
        return res.status(201).json({
          ...createdOrder._doc,
          razorpayOrder
        });
      } catch (error) {
        console.error('[OrderController] Razorpay initialization failed:', error.message);
        // We still return the created order, but include an error flag
        return res.status(201).json({
          ...createdOrder._doc,
          razorpayError: 'Failed to initialize payment gateway'
        });
      }
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
};
