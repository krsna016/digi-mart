require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  // --- WOMEN ---
  {
    name: "Floral Summer Dress",
    price: 2499,
    description: "Breathable cotton floral print dress, perfect for summer outings.",
    image: "https://images.unsplash.com/photo-1572804013307-a9a11198427e?auto=format&fit=crop&q=80&w=800",
    gender: "women",
    category: "mididresses",
    stock: 50,
    onSale: true,
    discountPrice: 1999
  },
  {
    name: "Classic Silk Blouse",
    price: 3899,
    description: "Premium mulberry silk blouse with a subtle sheen and elegant drape.",
    image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&q=80&w=800",
    gender: "women",
    category: "blouses&shirts",
    stock: 30
  },
  {
    name: "Wool Blend Cardigan",
    price: 2999,
    description: "Soft wool blend cardigan with tortoise-shell buttons.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    gender: "women",
    category: "cardigans",
    stock: 25
  },
  {
    name: "High-Waist Blue Jeans",
    price: 2999,
    description: "Stretchable denim with a perfect high-waist fit.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
    gender: "women",
    category: "jeans",
    stock: 45
  },
  {
    name: "Linen Maxi Dress",
    price: 4599,
    description: "Flowy linen maxi dress for a relaxed yet sophisticated look.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
    gender: "women",
    category: "maxidresses",
    stock: 20
  },

  // --- MEN ---
  {
    name: "Oversized Hoodie",
    price: 1299,
    description: "Heavyweight cotton hoodie with a relaxed oversized fit.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    gender: "men",
    category: "hoodies&sweatshirts",
    stock: 100,
    onSale: true,
    discountPrice: 999
  },
  {
    name: "Slim Fit Chinos",
    price: 2499,
    description: "Versatile slim-fit chinos made from premium stretch cotton.",
    image: "https://images.unsplash.com/photo-1473966968600-fa804b86829b?auto=format&fit=crop&q=80&w=800",
    gender: "men",
    category: "chinos",
    stock: 40
  },
  {
    name: "Linen Casual Shirt",
    price: 1899,
    description: "Breathable linen shirt, perfect for warm weather styling.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    gender: "men",
    category: "casualshirts",
    stock: 60
  },
  {
    name: "Structured Blazer",
    price: 6999,
    description: "Modern tailored blazer with a sophisticated structured silhouette.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    gender: "men",
    category: "blazers",
    stock: 15
  },
  {
    name: "Pique Polo Shirt",
    price: 1599,
    description: "Classic pique polo shirt with ribbed collar and cuffs.",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800",
    gender: "men",
    category: "poloshirts",
    stock: 50
  },

  // --- KIDS ---
  {
    name: "Cotton Graphic T-Shirt",
    price: 599,
    description: "Soft cotton tee with fun animated graphics.",
    image: "https://images.unsplash.com/photo-1519234164452-40f47e30740a?auto=format&fit=crop&q=80&w=800",
    gender: "kids",
    category: "t-shirts",
    stock: 150
  },
  {
    name: "Dinosaur Print Bodysuit",
    price: 899,
    description: "Cute organic cotton bodysuit for newborn boys.",
    image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=800",
    gender: "kids",
    category: "bodysuits",
    stock: 60
  },
  {
    name: "Pink Polka Dot Dress",
    price: 1199,
    description: "Adorable polka dot cotton dress with a matching headband.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800",
    gender: "kids",
    category: "dresses",
    stock: 40
  },
  {
    name: "Matching Play Set",
    price: 1299,
    description: "Coordinated t-shirt and shorts set for active play.",
    image: "https://images.unsplash.com/photo-1519704943960-da97e06a8448?auto=format&fit=crop&q=80&w=800",
    gender: "kids",
    category: "sets",
    stock: 80,
    onSale: true,
    discountPrice: 899
  }
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('MongoDB successfully seeded with latest clothing dataset!');
    process.exit();
  } catch (error) {
    console.error(`Error during database seeding: ${error}`);
    process.exit(1);
  }
};

importData();

