require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  // Women Apparel
  {
    name: "Silk Slip Dress",
    price: 120,
    description: "Effortless elegance in 100% mulberry silk. Designed with a delicate bias cut and adjustable straps.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "dresses",
    stock: 25
  },
  {
    name: "Linen Midi Dress",
    price: 90,
    description: "Breathable European flax linen for warm days. Features a flattering A-line silhouette and side pockets.",
    image: "https://images.unsplash.com/photo-1533659828870-95ee305cee3e?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "dresses",
    stock: 30
  },
  {
    name: "Cashmere Crewneck Sweater",
    price: 150,
    description: "Ultra-soft Grade-A Mongolian cashmere. A timeless essential for layering or wearing solo.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "sweaters",
    stock: 15
  },
  {
    name: "Alpaca V-Neck Sweater",
    price: 130,
    description: "Ethically sourced, hypoallergenic baby alpaca wool. Lightweight yet exceptionally warm.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "sweaters",
    stock: 20
  },
  {
    name: "Silk Button-Down Shirt",
    price: 110,
    description: "Timeless silhouette in premium washable silk. A versatile piece that transitions from day to night.",
    image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "tops",
    stock: 40
  },
  {
    name: "Organic Cotton Boxy Tee",
    price: 40,
    description: "The perfect everyday tee in 100% organic cotton. Features a relaxed, modern fit.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "tops",
    stock: 100
  },
  {
    name: "Cashmere Sweatpants",
    price: 140,
    description: "Elevated comfort for your downtime. Made from our signature soft cashmere blend.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "lounge",
    stock: 15
  },
  {
    name: "Silk Robe",
    price: 160,
    description: "Luxurious mulberry silk for slow mornings. Features wide sleeves and a matching silk belt.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "women",
    subcategory: "lounge",
    stock: 10
  },
  // Men Apparel
  {
    name: "Oxford Cotton Shirt",
    price: 80,
    description: "A classic wardrobe staple in durable organic cotton. Pre-washed for a soft, lived-in feel.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "men",
    subcategory: "shirts",
    stock: 50
  },
  {
    name: "Linen Short Sleeve Shirt",
    price: 70,
    description: "Keep cool in premium European linen. Cut for a relaxed fit with a modern camp collar.",
    image: "https://images.unsplash.com/photo-1594932224456-80db646452f4?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "men",
    subcategory: "shirts",
    stock: 45
  },
  {
    name: "Chino Twill Pants",
    price: 90,
    description: "Stretch-infused organic cotton for all-day comfort. Tailored with a slim-straight fit.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "men",
    subcategory: "pants",
    stock: 35
  },
  {
    name: "Lightweight Wool Trousers",
    price: 150,
    description: "Polished look in breathable merino wool. Perfect for year-round wear and travel.",
    image: "https://images.unsplash.com/photo-1473966968600-fa804b86962f?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "men",
    subcategory: "pants",
    stock: 25
  },
  {
    name: "Recycled Nylon Bomber",
    price: 120,
    description: "Sleek and sustainable lightweight jacket. Water-resistant finish with premium hardware.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aec96e5fe?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "men",
    subcategory: "outerwear",
    stock: 20
  },
  {
    name: "Wool Overcoat",
    price: 250,
    description: "Timeless style in heavy-weight Italian wool. Fully lined with a sophisticated notched lapel.",
    image: "https://images.unsplash.com/photo-1544022613-e87f17a7845f?auto=format&fit=crop&q=80&w=800",
    mainCategory: "apparel",
    category: "men",
    subcategory: "outerwear",
    stock: 10
  },
  // Home
  {
    name: "Bamboo Sheet Set",
    price: 120,
    description: "Silky soft and naturally cooling bamboo fabric. Moisture-wicking and hypoallergenic.",
    image: "https://images.unsplash.com/photo-1629949009765-40f33100f869?auto=format&fit=crop&q=80&w=800",
    mainCategory: "home",
    category: "general",
    subcategory: "bedding",
    stock: 30
  },
  {
    name: "Down Alternative Comforter",
    price: 180,
    description: "Fluffy and hypoallergenic for a perfect night's sleep. Mimics the loft of down without the feathers.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800",
    mainCategory: "home",
    category: "general",
    subcategory: "bedding",
    stock: 15
  },
  {
    name: "Turkish Cotton Towel Set",
    price: 90,
    description: "Ultra-absorbent and quick-drying 100% Turkish cotton. Features a plush 700 GSM weight.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    mainCategory: "home",
    category: "general",
    subcategory: "bath",
    stock: 50
  },
  {
    name: "Waffle Knit Bathrobe",
    price: 80,
    description: "Lightweight and absorbent waffle texture. Made from premium Turkish cotton for a spa-like feel.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
    mainCategory: "home",
    category: "general",
    subcategory: "bath",
    stock: 25
  },
  {
    name: "Wool Dryer Balls",
    price: 20,
    description: "Eco-friendly alternative to dryer sheets. Reduces drying time and naturally softens clothes.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
    mainCategory: "home",
    category: "general",
    subcategory: "essentials",
    stock: 200
  },
  {
    name: "Linen Napkin Set",
    price: 40,
    description: "Elegant and sustainable dining essentials. Made from 100% stonewashed European flax linen.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800",
    mainCategory: "home",
    category: "general",
    subcategory: "essentials",
    stock: 60
  },
  // Decor
  {
    name: "Marble Bookends",
    price: 60,
    description: "Handcrafted from solid Italian marble. A heavy and elegant addition to any bookshelf.",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=800",
    mainCategory: "decor",
    category: "general",
    subcategory: "decor",
    stock: 15
  },
  {
    name: "Ceramic Vase",
    price: 45,
    description: "Minimalist matte finish for any space. Hand-turned ceramic with a modern aesthetic.",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800",
    mainCategory: "decor",
    category: "general",
    subcategory: "decor",
    stock: 30
  },
  {
    name: "Mid-Century Side Table",
    price: 200,
    description: "Solid walnut wood with a sleek profile. Features a convenient drawer for bedside essentials.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    mainCategory: "decor",
    category: "general",
    subcategory: "furniture",
    stock: 5
  },
  {
    name: "Velvet Ottoman",
    price: 150,
    description: "Adds a touch of luxury and extra seating. Upholstered in premium, easy-clean velvet.",
    image: "https://images.unsplash.com/photo-1538688413619-a4471fe4d915?auto=format&fit=crop&q=80&w=800",
    mainCategory: "decor",
    category: "general",
    subcategory: "furniture",
    stock: 8
  },
  // Kitchen
  {
    name: "Stainless Steel Cookware Set",
    price: 300,
    description: "Professional-grade 5-ply construction for even heating. Includes essential pots and pans.",
    image: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=800",
    mainCategory: "kitchen",
    category: "general",
    subcategory: "kitchen items",
    stock: 10
  }
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('MongoDB successfully seeded with latest product dataset!');
    process.exit();
  } catch (error) {
    console.error(`Error during database seeding: ${error}`);
    process.exit(1);
  }
};

importData();
