"use client";

import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

function SaleContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
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
        
        // Filter by onSale: true
        const saleProducts = data.filter((p: any) => p.onSale === true);
        
        setProducts(saleProducts);
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
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortOption === 'price-asc') return priceA - priceB;
    if (sortOption === 'price-desc') return priceB - priceA;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />

      <div className="bg-red-50 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 mb-4 animate-fade-up">Seasonal Event</p>
          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 animate-fade-up tracking-tight">The Sale Selection</h1>
          <p className="text-sm font-normal text-stone-500 max-w-xl mx-auto animate-fade-up leading-relaxed">
            Discover exceptional quality at extraordinary value. Limited time offers on seasonal favorites.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-12 pb-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          {loading ? 'Discovering offers...' : `${displayProducts.length} pieces on sale`}
        </p>
        
        <div className="relative isolate" onMouseLeave={() => setIsSortOpen(false)}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2.5 pb-2 border-b border-stone-200 hover:border-stone-900 text-[10px] font-bold uppercase tracking-widest text-stone-900 transition-all min-w-[160px] justify-between group"
          >
            <span>{sortOption === 'featured' ? 'Featured' : sortOption === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}</span>
            <svg className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-100 rounded-xl shadow-xl z-50 p-2 overflow-hidden">
              {['featured', 'price-asc', 'price-desc'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => { setSortOption(opt as SortOption); setIsSortOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${sortOption === opt ? 'bg-stone-50 text-stone-900' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50/50'}`}
                >
                  {opt === 'featured' ? 'Featured' : opt === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32"><div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" /></div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-32 animate-fade-up">
            <p className="text-stone-400 text-sm mb-8">No sale items active right now.</p>
            <Link href="/" className="bg-stone-900 text-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-lg transition-all">Continue Shopping</Link>
          </div>
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

export default function SalePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-stone-300">...</div>}>
      <SaleContent />
    </Suspense>
  );
}
