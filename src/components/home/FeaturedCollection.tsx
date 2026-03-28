"use client";

import Link from "next/link";

export default function FeaturedCollection() {
  return (
    <section className="w-full bg-[#FCFBF8] py-8 rounded-[2.5rem]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-6">Featured Editorial</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 tracking-tight leading-[1.1] mb-8">
              The Art of <br /> Minimal Living
            </h2>
            <p className="text-stone-600 font-light leading-relaxed max-w-md mb-10 text-[15px]">
              Explore our latest editorial capturing the essence of quiet luxury. Premium textures, muted palettes, and intentionally designed silhouettes for a wardrobe that transcends seasons.
            </p>
            <Link 
              href="/about"
              className="group relative inline-flex overflow-hidden rounded-full bg-stone-900 text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-transform duration-300 hover:scale-105 self-start"
            >
              <span className="relative z-10">Read the Story</span>
              <div className="absolute inset-0 bg-stone-800 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
            </Link>
          </div>

          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[600px] sm:h-[700px]">
            <div className="col-span-1 h-full overflow-hidden rounded-[2.5rem] bg-stone-100">
              <img 
                src="/images/home_feature_main.png" 
                alt="Main Feature" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
              <div className="row-span-1 overflow-hidden rounded-[2.5rem] bg-stone-100">
                <img 
                  src="/images/home_feature_sub1.png" 
                  alt="Feature detail 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="row-span-1 overflow-hidden rounded-[2.5rem] bg-stone-100">
                <img 
                  src="/images/home_feature_sub2.png" 
                  alt="Feature detail 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
