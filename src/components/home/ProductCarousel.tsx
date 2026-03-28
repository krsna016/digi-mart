"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';

export default function ProductCarousel({ title, subtitle }: { title: string, subtitle: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        // Sort newest first
        const sorted = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sorted.slice(0, 8)); // Grab first 8
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="py-32 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" /></div>
  );

  return (
    <section className="w-full py-4 bg-white overflow-hidden rounded-lg">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight leading-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => scroll('left')} className="p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
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
