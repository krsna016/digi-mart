require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const connectDB = require('./config/db');

const categoriesToSeed = [
  {
    gender: 'men',
    group: 'Tops',
    items: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Polo Shirts", "Hoodies", "Sweatshirts", "Graphic Tees", "Denim Shirts", "Flannel Shirts"]
  },
  {
    gender: 'men',
    group: 'Bottoms',
    items: ["Jeans", "Chinos", "Joggers", "Shorts", "Cargo Pants", "Formal Trousers", "Sweatpants"]
  },
  {
    gender: 'men',
    group: 'Outerwear',
    items: ["Jackets", "Coats", "Blazers", "Vests", "Quilted Jackets", "Leather Jackets", "Bombers"]
  },
  {
    gender: 'men',
    group: 'Loungewear',
    items: ["Night Shirts", "Pyjamas", "Boxers", "Robes", "Lounge Pants"]
  },
  {
    gender: 'men',
    group: 'Featured',
    items: ["New Arrivals", "Best Sellers", "Summer Edit", "Sale", "Essentials"]
  },
  {
    gender: 'women',
    group: 'Tops',
    items: ["Blouses", "Shirts", "T-Shirts", "Camisoles", "Bodysuits", "Sweaters", "Cardigans", "Crop Tops", "Tunics"]
  },
  {
    gender: 'women',
    group: 'Bottoms',
    items: ["Jeans", "Skirts", "Pants", "Trousers", "Leggings", "Shorts", "Culottes", "Joggers"]
  },
  {
    gender: 'women',
    group: 'Dresses',
    items: ["Mini Dresses", "Midi Dresses", "Maxi Dresses", "Jumpsuits", "Rompers", "Cocktail Dresses", "Evening Gowns"]
  },
  {
    gender: 'women',
    group: 'Outerwear',
    items: ["Jackets", "Coats", "Blazers", "Trench Coats", "Shrugs", "Puffer Jackets"]
  },
  {
    gender: 'women',
    group: 'Ethnic Wear',
    items: ["Kurtas", "Kurta Sets", "Sarees", "Lehengas", "Anarkalis", "Palazzos"]
  },
  {
    gender: 'women',
    group: 'Featured',
    items: ["New Arrivals", "Best Sellers", "Wedding Guest", "Sale", "Eco-Friendly"]
  },
  {
    gender: 'kids',
    group: 'Boys',
    items: ["T-Shirts", "Shirts", "Pants", "Jeans", "Shorts", "Activewear", "Hoodies", "Dungarees"]
  },
  {
    gender: 'kids',
    group: 'Girls',
    items: ["Dresses", "Tops", "Skirts", "Shorts", "Leggings", "Sets", "Jumpsuits", "Party Wear"]
  },
  {
    gender: 'kids',
    group: 'Baby',
    items: ["Onesies", "Rompers", "Sets", "Sleepwear", "Swaddles", "Bibs", "Knitwear"]
  },
  {
    gender: 'kids',
    group: 'Featured',
    items: ["New Arrivals", "Best Sellers", "Back to School", "Sale", "Playground Ready"]
  }
];

const migrateCategories = async () => {
  try {
    await connectDB();
    
    // Clear existing categories
    await Category.deleteMany();
    
    // Insert new categories
    await Category.insertMany(categoriesToSeed);
    
    console.log('Categories successfully migrated to database!');
    process.exit();
  } catch (error) {
    console.error(`Error migrating categories: ${error.message}`);
    process.exit(1);
  }
};

migrateCategories();
