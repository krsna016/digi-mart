require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const categoryConfig = {
  apparel: {
    women: ["dresses", "tops", "skirts", "pants", "sweaters", "jackets", "activewear", "swimwear", "lingerie", "sleepwear"],
    men: ["shirts", "t-shirts", "pants", "jeans", "sweaters", "jackets", "outerwear", "activewear", "underwear", "sleepwear"],
    kids: ["baby", "toddler", "boys", "girls", "school uniforms", "activewear", "outerwear", "accessories", "shoes", "toys"],
    unisex: ["t-shirts", "hoodies", "jackets", "pants", "hats", "socks", "bags", "streetwear", "basics", "loungewear"],
    sportswear: ["running", "training", "yoga", "swimming", "cycling", "outdoor", "team sports", "compression", "accessories", "footwear"],
    lounge: ["sets", "robes", "slippers", "soft bras", "knits", "shorts", "pants", "tees", "blankets", "eye masks"],
    formal: ["suits", "dresses", "blazers", "tuxedos", "evening wear", "shoes", "accessories", "shirts", "skirts", "coats"],
    casual: ["basics", "denim", "knits", "relaxed fit", "shorts", "tees", "flannels", "everyday wear", "sneakers", "totes"],
    outerwear: ["coats", "parkas", "trench coats", "leather jackets", "puffer jackets", "vests", "windbreakers", "rainwear", "winter gear", "wool coats"],
    intimates: ["bras", "panties", "shapers", "hosiery", "bodysuits", "silk slips", "cotton basics", "lace", "sport bras", "maternity"]
  },
  accessories: {
    bags: ["totes", "backpacks", "clutches", "crossbody", "wallets", "travel bags", "briefcases", "satchels", "pouches", "bucket bags"],
    jewelry: ["necklaces", "earrings", "rings", "bracelets", "watches", "brooches", "charms", "luxury", "minimalist", "handmade"],
    watches: ["analog", "digital", "smartwatches", "luxury", "sport", "leather strap", "metal band", "minimalist", "vintage", "chronographs"],
    eyewear: ["sunglasses", "blue light", "reading glasses", "luxury frames", "sport shades", "retro", "minimalist", "cases", "chains", "cleaning kits"],
    belts: ["leather", "textile", "braided", "luxury", "minimalist", "wide", "skinny", "buckles", "suede", "reversible"],
    hats: ["beanies", "caps", "fedoras", "bucket hats", "sun hats", "berets", "visors", "headbands", "winter hats", "silk scarves"],
    scarves: ["silk", "wool", "cashmere", "linen", "printed", "solid", "winter", "lightweight", "oversized", "square"],
    gloves: ["leather", "wool", "touchscreen", "mittens", "driving", "winter", "luxury", "sport", "knitted", "suede"],
    tech: ["phone cases", "laptop sleeves", "airpod cases", "chargers", "cables", "tablet covers", "watch bands", "organizers", "desk mats", "stands"],
    travel: ["suitcases", "carry-ons", "packing cubes", "neck pillows", "eye masks", "passport holders", "luggage tags", "travel kits", "locks", "weight scales"]
  },
  home: {
    bedding: ["sheets", "duvet covers", "pillows", "comforters", "quilts", "blankets", "mattress protectors", "pillowcases", "throws", "bed skirts"],
    bath: ["towels", "bath mats", "shower curtains", "robes", "towels sets", "organizers", "dispensers", "mirrors", "scales", "scents"],
    kitchen: ["cookware", "bakeware", "utensils", "storage", "appliances", "textiles", "cleaning", "pantry", "tools", "gadgets"],
    dining: ["dinnerware", "glassware", "cutlery", "linens", "placemats", "coasters", "serving bowls", "trays", "pitchers", "barware"],
    lighting: ["floor lamps", "table lamps", "pendant lights", "chandeliers", "wall sconces", "smart lighting", "bulbs", "outdoor lighting", "string lights", "shades"],
    rugs: ["area rugs", "runners", "doormats", "outdoor rugs", "kitchen mats", "jute rugs", "wool rugs", "shag rugs", "vintage rugs", "washable rugs"],
    curtains: ["sheer", "blackout", "linen", "velvet", "patterned", "rods", "rings", "holdbacks", "valances", "blinds"],
    storage: ["baskets", "bins", "boxes", "shelving", "hooks", "closet systems", "shoe racks", "jewelry boxes", "office organizers", "garage storage"],
    furniture: ["sofas", "chairs", "tables", "beds", "desks", "stools", "benches", "dressers", "cabinets", "outdoor furniture"],
    garden: ["pots", "planters", "tools", "seeds", "decor", "outdoor lighting", "furniture", "watering kits", "gloves", "statues"]
  },
  decor: {
    "wall art": ["paintings", "prints", "posters", "wall hangings", "canvases", "frames", "mirrors", "clocks", "shelves", "decals"],
    vases: ["ceramic", "glass", "minimalist", "sculptural", "small", "large", "bud vases", "floor vases", "terracotta", "metallic"],
    candles: ["scented", "taper", "pillar", "votive", "tealight", "holders", "diffusers", "incense", "matches", "gift sets"],
    sculptures: ["abstract", "figurative", "modern", "classical", "small decor", "bookends", "paperweights", "objects", "metal", "wood"],
    mirrors: ["wall mirrors", "floor mirrors", "round", "rectangular", "decorative", "minimalist", "vanity", "bathroom", "gold frame", "black frame"],
    pillows: ["decorative", "textured", "printed", "velvet", "linen", "inserts", "lumbar", "square", "round", "tassel"],
    throws: ["cotton", "wool", "cashmere", "faux fur", "knit", "patterned", "solid", "lightweight", "winter", "tasseled"],
    clocks: ["wall", "desk", "analog", "digital", "modern", "vintage", "minimalist", "large", "silent", "wood"],
    frames: ["photo frames", "art frames", "gallery sets", "minimalist", "classic", "wood", "metal", "acrylic", "standing", "hanging"],
    plants: ["indoor", "artificial", "dried flowers", "succulents", "tall plants", "hanging plants", "plant stands", "pots", "soil & kits", "misters"]
  },
  kitchen: {
    cookware: ["pots", "pans", "skillets", "dutch ovens", "woks", "griddles", "lids", "cast iron", "stainless steel", "non-stick"],
    bakeware: ["cake pans", "muffin tins", "baking sheets", "mixing bowls", "rolling pins", "measuring cups", "cookie cutters", "cooling racks", "silicone mats", "pastry tools"],
    cutlery: ["chef knives", "paring knives", "steak knives", "knife sets", "sharpeners", "boards", "blocks", "shears", "bread knives", "santoku"],
    utensils: ["spatulas", "spoons", "tongs", "whisks", "ladles", "turners", "peelers", "graters", "mashers", "can openers"],
    appliances: ["toasters", "blenders", "mixers", "air fryers", "kettles", "coffee makers", "microwave", "slow cookers", "food processors", "juicers"],
    storage: ["containers", "jars", "bread boxes", "spice racks", "canisters", "foil & wrap", "lunch boxes", "bag clips", "labels", "organizers"],
    "coffee & tea": ["french press", "pour over", "mugs", "teapots", "tea infusers", "grinders", "storage", "frothers", "espresso tools", "kettles"],
    barware: ["shakers", "stainers", "corkscrews", "bottle openers", "glassware", "ice buckets", "measuring tools", "jiggers", "decanters", "coasters"],
    textiles: ["aprons", "oven mitts", "dish towels", "napkins", "tablecloths", "runners", "placemats", "coasters", "tea towels", "pot holders"],
    gadgets: ["thermometers", "scales", "timers", "presses", "slicers", "choppers", "spiralizers", "infusers", "scrubbers", "dish racks"]
  }
};

const generateProducts = () => {
  const products = [];
  const images = [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1533659828870-95ee305cee3e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&q=80&w=800"
  ];

  Object.entries(categoryConfig).forEach(([mainCat, cats]) => {
    Object.entries(cats).forEach(([cat, subcats]) => {
      // Create at least one product for each category
      const subcat = subcats[0];
      products.push({
        name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} ${subcat.charAt(0).toUpperCase() + subcat.slice(1)}`,
        price: Math.floor(Math.random() * 200) + 50,
        description: `Premium quality ${subcat} for your ${cat} collection in the ${mainCat} category.`,
        image: images[Math.floor(Math.random() * images.length)],
        mainCategory: mainCat,
        category: cat,
        subcategory: subcat,
        stock: Math.floor(Math.random() * 100) + 10
      });
    });
  });
  return products;
};

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products cross 50 categories!`);
    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error}`);
    process.exit(1);
  }
};

seedData();
