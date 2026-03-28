"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PROMOS = [
  {
    title: "New Arrivals",
    subtitle: "Modern Indian Collection",
    description: "Discover our newly added handcrafted ethnic pieces.",
    image: "/images/indian_new_arrivals_bg.png",
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
            {promo.image && (
              <>
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-700" />
              </>
            )}
            {!promo.image && (
              <div className="absolute inset-0 bg-background-alt border border-stone-200 group-hover:bg-stone-100 transition-colors duration-700" />
            )}
            
            <div className="absolute inset-0 p-10 lg:p-16 flex flex-col justify-end">
              <span className={`text-[10px] font-bold uppercase tracking-[0.4em] mb-4 drop-shadow-sm ${promo.isSale ? 'text-red-400' : 'text-stone-400'}`}>
                {promo.subtitle}
              </span>
              <h3 className={`text-4xl lg:text-5xl font-serif mb-6 tracking-tight drop-shadow-md ${promo.image ? 'text-white' : 'text-foreground'}`}>
                {promo.title}
              </h3>
              <p className={`text-sm max-w-xs mb-10 leading-relaxed drop-shadow-sm ${promo.image ? 'text-stone-200/90' : 'text-stone-500'}`}>
                {promo.description}
              </p>
              
              <Link
                href={promo.link}
                className="w-full sm:w-max px-10 py-4 bg-background/95 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm hover:bg-background transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
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
