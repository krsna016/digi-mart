"use client";

import Link from "next/link";

export default function LookbookSection() {
  return (
    <section className="w-full bg-[#F2F0E9] py-8 rounded-[2.5rem]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-4">Style Guide</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight leading-tight">The Lookbook</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Image 1 - Large Vertical */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-[2.5rem] bg-stone-200 aspect-[3/4]">
            <img 
              src="/images/lookbook_1.png" 
              alt="Lookbook Style 1" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          <div className="md:col-span-7 grid grid-rows-2 gap-6 lg:gap-8 h-full">
            {/* Image 2 - Horizontal/Square */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-200 aspect-video md:aspect-auto">
              <img 
                src="/images/lookbook_3.png" 
                alt="Lookbook Style 2" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Split row */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-200 aspect-[4/5] md:aspect-auto">
                <img 
                  src="/images/lookbook_2.png" 
                  alt="Lookbook Style 3" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center items-start p-6 lg:p-10 rounded-[2.5rem] bg-white">
                <h3 className="text-2xl font-serif text-stone-900 mb-4">Effortless Elegance</h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed mb-8">
                  Discover how to style our latest pieces for a seamless transition from day to evening.
                </p>
                <Link 
                  href="/about"
                  className="text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors"
                >
                  View Full Gallery
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
