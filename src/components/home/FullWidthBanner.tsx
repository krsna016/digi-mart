"use client";

import Link from "next/link";

export default function FullWidthBanner() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden rounded-lg">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/home_full_width_banner.png" 
          alt="New Season Drop" 
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear hover:scale-110"
        />
        <div className="absolute inset-0 bg-stone-900/40" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <span className="block text-[12px] font-bold uppercase tracking-[0.4em] text-stone-300 mb-6 drop-shadow-sm">Elevate Your Wardrobe</span>
        <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight mb-8 drop-shadow-md">
          New Season Drop
        </h2>
        <Link 
          href="/new"
          className="group relative inline-block overflow-hidden rounded-full bg-white text-stone-900 px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] transition-transform duration-300 hover:scale-105"
        >
          <span className="relative z-10">Discover The Collection</span>
          <div className="absolute inset-0 bg-stone-100 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
        </Link>
      </div>
    </section>
  );
}
