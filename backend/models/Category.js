const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  gender: { 
    type: String, 
    enum: ['men', 'women', 'kids'], 
    required: true 
  },
  group: { 
    type: String, 
    required: true 
  },
  items: [
    { 
      type: String,
      required: true
    }
  ]
}, { timestamps: true });

// Ensure unique combination of gender and group
categorySchema.index({ gender: 1, group: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
