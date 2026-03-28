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
    required: false
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'kids'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  onSale: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number,
    default: null
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

