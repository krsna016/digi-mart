export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cashmere Crew Sweater",
    price: 120,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    category: "Apparel",
    description: "Incredibly soft, 100% Grade-A Mongolian cashmere. Lightweight yet warm, designed for a relaxed, timeless fit."
  },
  {
    id: "2",
    name: "Italian Leather Tote",
    price: 250,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800",
    category: "Accessories",
    description: "Handcrafted in Florence from full-grain responsive leather. Features a spacious interior and minimalistic hardware."
  },
  {
    id: "3",
    name: "Silk Sleep Mask",
    price: 45,
    image: "https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&q=80&w=800",
    category: "Home",
    description: "Crafted from pure mulberry silk to protect your skin and hair while you rest."
  },
  {
    id: "4",
    name: "Linen Bedding Set",
    price: 180,
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=800",
    category: "Home",
    description: "European flax linen that grows softer with every wash. Naturally breathable and thermo-regulating."
  },
  {
    id: "5",
    name: "Ceramic Table Lamp",
    price: 150,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
    category: "Decor",
    description: "A sculptural piece featuring a matte ceramic base and a soft ambient glow."
  },
  {
    id: "6",
    name: "Minimalist Gold Watch",
    price: 195,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
    category: "Accessories",
    description: "A timeless timepiece featuring a slim gold-plated case and a premium leather strap."
  },
  {
    id: "7",
    name: "Organic Cotton Tee",
    price: 35,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    category: "Apparel",
    description: "The perfectly draped t-shirt. Made from 100% organic cotton for ultimate breathability."
  },
  {
    id: "8",
    name: "Alpaca Throw Blanket",
    price: 110,
    image: "https://images.unsplash.com/photo-1580870059762-cb03f268b8a0?auto=format&fit=crop&q=80&w=800",
    category: "Home",
    description: "Ethically sourced baby alpaca wool woven into a luxurious, ultra-soft, hypoallergenic throw."
  },
  {
    id: "9",
    name: "Hand-Poured Soy Candle",
    price: 28,
    image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800",
    category: "Home",
    description: "A rich and grounding blend of sandalwood, amber, and subtle cardamom, poured into a reusable glass vessel."
  },
  {
    id: "10",
    name: "Premium Leather Wallet",
    price: 85,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800",
    category: "Accessories",
    description: "Ultra-slim profile cardholder made meticulously from full-grain vegetable-tanned leather."
  },
  {
    id: "11",
    name: "Matte Black French Press",
    price: 65,
    image: "https://images.unsplash.com/photo-1596797585461-1e9bf9e8a5b4?auto=format&fit=crop&q=80&w=800",
    category: "Kitchen",
    description: "Double-walled stainless steel construction keeps your coffee hot while the sleek matte finish elevates your kitchen."
  },
  {
    id: "12",
    name: "Essential Oil Diffuser",
    price: 95,
    image: "https://images.unsplash.com/photo-1608560377074-ce45f639014b?auto=format&fit=crop&q=80&w=800",
    category: "Home",
    description: "A stone ceramic diffuser designed to beautifully mist essential oils while looking like a piece of art."
  }
];
