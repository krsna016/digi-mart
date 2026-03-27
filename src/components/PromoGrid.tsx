"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PROMOS = [
  {
    title: "New Arrivals",
    subtitle: "The Season's Best",
    description: "Explore our latest drops and architectural silhouettes.",
    image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=1200",
    link: "/new",
    cta: "Shop New"
  },
  {
    title: "Seasonal Sale",
    subtitle: "Limited Time Offers",
    description: "Exceptional quality meet extraordinary value.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200",
    link: "/sale",
    cta: "View Sale",
    isSale: true
  }
];

export default function PromoGrid() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-12 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {PROMOS.map((promo, idx) => (
          <motion.div
            key={promo.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.2, 0, 0, 1] }}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-100"
          >
            <img 
              src={promo.image} 
              alt={promo.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-700" />
            
            <div className="absolute inset-0 p-10 lg:p-16 flex flex-col justify-end">
              <span className={`text-[10px] font-bold uppercase tracking-[0.4em] mb-4 drop-shadow-sm ${promo.isSale ? 'text-red-400' : 'text-stone-300'}`}>
                {promo.subtitle}
              </span>
              <h3 className="text-4xl lg:text-5xl font-serif text-white mb-6 tracking-tight drop-shadow-md">
                {promo.title}
              </h3>
              <p className="text-sm text-stone-200/90 max-w-xs mb-10 leading-relaxed drop-shadow-sm">
                {promo.description}
              </p>
              
              <Link
                href={promo.link}
                className="w-full sm:w-max px-10 py-4 bg-white/95 backdrop-blur-sm text-stone-900 text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm hover:bg-white transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
              >
                {promo.cta}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
