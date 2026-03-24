require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Use JSON middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user/address', addressRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/contact', contactRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
