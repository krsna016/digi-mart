"use client";

import Link from "next/link";

const CATEGORIES = [
  {
    title: "Women's Collection",
    image: "/images/home_cat_women.png",
    link: "/category/women",
  },
  {
    title: "Men's Collection",
    image: "/images/home_cat_men.png",
    link: "/category/men",
  },
  {
    title: "Kids' Collection",
    image: "/images/home_cat_kids.png",
    link: "/category/kids",
  },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-white py-4">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Curated Selection</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight leading-tight">Shop by Category</h2>
          </div>
          <p className="text-sm font-light text-stone-500 max-w-sm leading-relaxed mb-2 md:text-right">
            Explore our meticulously crafted pieces designed for every aspect of your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.link}
              className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100"
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/10 transition-opacity duration-500 group-hover:bg-stone-900/40" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[2.5rem] transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-xl font-serif text-stone-900 mb-2">{cat.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    Explore 
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
