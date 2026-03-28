"use client";

import { useRef } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ProductCarousel({ 
  title, 
  subtitle,
  products = []
}: { 
  title: string, 
  subtitle: string,
  products?: any[]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full py-20 bg-background-alt overflow-hidden rounded-[2.5rem] shadow-premium border border-stone-200/40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight leading-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => scroll('left')} className="p-3 border border-stone-300 rounded-full hover:bg-background-alt transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="p-3 border border-stone-300 rounded-full hover:bg-background-alt transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scroll-bar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product._id || product.id} className="min-w-[280px] md:min-w-[320px] snap-start shrink-0">
              <ProductCard {...product} id={product._id || product.id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
