"use client";

import Link from "next/link";

export default function SaleSection() {
  return (
    <section className="relative w-full py-16 md:py-24 flex items-center justify-center overflow-hidden rounded-[2.5rem]">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/home_sale_bg.png" 
          alt="Sale Event" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-stone-900/10" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 border rounded-full border-stone-400/50 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md mb-8">
          Mid-Season Event
        </span>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-none mb-6 drop-shadow-lg">
          Up To 40% Off
        </h2>
        <p className="text-stone-300 font-light mb-12 text-sm md:text-base max-w-xl mx-auto drop-shadow">
          An exclusive opportunity to acquire our signature pieces. Select styles from previous collections are now available at a specialized value.
        </p>
        <Link 
          href="/sale"
          className="group relative inline-block overflow-hidden rounded-full bg-white text-stone-900 px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] transition-transform duration-300 hover:scale-105"
        >
          <span className="relative z-10">Shop The Event</span>
          <div className="absolute inset-0 bg-stone-200 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
        </Link>
      </div>
    </section>
  );
}
