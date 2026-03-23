const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Use JSON middleware
app.use(express.json());

// Mount routes
app.use('/api/products', productRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
