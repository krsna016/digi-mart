require('dotenv').config();
const mongoose = require('mongoose');

// Define a minimal schema to bypass strict validation if necessary,
// or just use the current model. We will use the current model to ensure we satisfy New format.
const Product = require('./models/Product');

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Migration');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate.`);

    let updatedCount = 0;

    for (const product of products) {
      let changed = false;
      const oldCategory = product.category ? product.category.toLowerCase() : '';

      // Standardize to the new hierarchy format if missing
      if (!product.mainCategory || product.mainCategory === '') {
        switch (oldCategory) {
          case 'apparel':
            product.mainCategory = 'apparel';
            product.category = 'women'; // Defaulting to one of the enum options
            product.subcategory = 'dresses';
            break;
          case 'accessories':
            product.mainCategory = 'accessories';
            product.category = 'general';
            product.subcategory = 'accessories';
            break;
          case 'home':
            product.mainCategory = 'home';
            product.category = 'general';
            product.subcategory = 'essentials';
            break;
          case 'decor':
            product.mainCategory = 'decor';
            product.category = 'general';
            product.subcategory = 'decor';
            break;
          case 'kitchen':
            product.mainCategory = 'kitchen';
            product.category = 'general';
            product.subcategory = 'kitchen';
            break;
          default:
            // Fallback for unhandled categories
            product.mainCategory = 'apparel';
            product.category = 'general';
            product.subcategory = 'basics';
        }
        changed = true;
      }

      if (changed) {
        await product.save();
        updatedCount++;
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log(`Migration complete! Successfully updated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error(`Migration Failed: ${error.message}`);
    process.exit(1);
  }
};

runMigration();
