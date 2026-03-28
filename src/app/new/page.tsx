"use client";

import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

function NewArrivalsContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/products`, {
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Sort by createdAt descending for New Arrivals
        const sorted = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setProducts(sorted);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const displayProducts = [...products].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />

      <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/indian_new_arrivals_bg.png" 
            alt="New Arrivals" 
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-200 mb-4 animate-fade-up">Latest Collection</p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 animate-fade-up drop-shadow-md">New Arrivals</h1>
          <p className="text-sm font-light text-stone-100 max-w-xl mx-auto px-6 animate-fade-up drop-shadow-sm">
            Explore our latest drops and seasonal essentials designed for modern living.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-12 pb-6 flex justify-between items-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          {loading ? 'Discovering pieces...' : `${displayProducts.length} New Arrivals`}
        </p>
        
        <div className="relative isolate" onMouseLeave={() => setIsSortOpen(false)}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2.5 pb-2 border-b border-stone-200 hover:border-stone-900 text-[10px] font-bold uppercase tracking-widest text-stone-900 transition-all min-w-[160px] justify-between group"
          >
            <span>{sortOption === 'newest' ? 'Newest First' : sortOption === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}</span>
            <svg className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-100 rounded-xl shadow-xl z-50 p-2 overflow-hidden">
              {['newest', 'price-asc', 'price-desc'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => { setSortOption(opt as SortOption); setIsSortOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${sortOption === opt ? 'bg-stone-50 text-stone-900' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50/50'}`}
                >
                  {opt === 'newest' ? 'Newest First' : opt === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32"><div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {displayProducts.map((product: any) => (
              <ProductCard key={product._id || product.id} {...product} id={product._id || product.id} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-stone-300">...</div>}>
      <NewArrivalsContent />
    </Suspense>
  );
}
