const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  mainCategory: {
    type: String,
    enum: ['apparel', 'accessories', 'home', 'decor', 'kitchen'],
    required: true
  },
  category: {
    type: String,
    enum: ['women', 'men', 'general'],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
