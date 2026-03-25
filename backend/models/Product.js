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
    enum: [
      // Apparel
      'women', 'men', 'kids', 'unisex', 'sportswear', 'lounge', 'formal', 'casual', 'outerwear', 'intimates',
      // Accessories
      'bags', 'jewelry', 'watches', 'eyewear', 'belts', 'hats', 'scarves', 'gloves', 'tech', 'travel',
      // Home
      'bedding', 'bath', 'kitchen', 'dining', 'lighting', 'rugs', 'curtains', 'storage', 'furniture', 'garden',
      // Decor
      'wall art', 'vases', 'candles', 'sculptures', 'mirrors', 'pillows', 'throws', 'clocks', 'frames', 'plants',
      // Kitchen
      'cookware', 'bakeware', 'cutlery', 'utensils', 'appliances', 'storage', 'coffee & tea', 'barware', 'textiles', 'gadgets',
      // Fallback
      'general'
    ],
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
