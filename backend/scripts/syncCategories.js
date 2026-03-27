const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const Category = require('../models/Category');

const syncCategories = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not found in environment');
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Get all unique (gender, category) pairs from Products
    const products = await Product.find({}, 'gender category');
    const productCategories = new Set();
    products.forEach(p => {
      productCategories.add(`${p.gender.toLowerCase()}:::${p.category.toLowerCase().trim()}`);
    });

    console.log(`Found ${productCategories.size} unique categories in Products collection.`);

    // 2. Get existing categories from Categories collection
    const existingCats = await Category.find({});
    const existingMap = new Set();
    existingCats.forEach(c => {
      // In the Category model, 'group' is the display name, and 'items' are subgroups.
      // But products use a single string 'category' (e.g., 'mididresses').
      // We will check if the product's 'category' is either a Group name OR an Item name.
      existingMap.add(`${c.gender.toLowerCase()}:::${c.group.toLowerCase().trim()}`);
      c.items.forEach(item => {
        existingMap.add(`${c.gender.toLowerCase()}:::${item.toLowerCase().trim()}`);
      });
    });

    let addedCount = 0;
    for (const entry of productCategories) {
      const [gender, catName] = entry.split(':::');
      
      // If the product category is NOT in the Category collection
      if (!existingMap.has(entry)) {
        console.log(`- Syncing missing category: [${gender}] ${catName}`);
        
        // We add it as a new GROUP with its own name as the first item
        // This ensures it shows up in the Navbar and Dashboard
        const newCat = new Category({
          gender,
          group: catName.charAt(0).toUpperCase() + catName.slice(1), // Capitalize
          items: [catName.charAt(0).toUpperCase() + catName.slice(1)]
        });
        
        await newCat.save();
        addedCount++;
        // Update local map to avoid duplicates if multiple products have same gender/cat
        existingMap.add(entry);
      }
    }

    console.log(`\nSynchronization complete! Added ${addedCount} new category groups.`);
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
};

syncCategories();
