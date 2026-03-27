"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { api } from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gender = (params.gender as string)?.toLowerCase();
  
  const [products, setProducts] = useState<any[]>([]);
  const [genderCategories, setGenderCategories] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const fetchGenderCategories = async () => {
      try {
        const data = await api.get('/categories');
        const relevant = data.filter((c: any) => c.gender.toLowerCase() === gender);
        // Flatten all items from all groups for this gender
        const allItems = relevant.reduce((acc: string[], curr: any) => {
          return [...acc, ...curr.items];
        }, []);
        // Unique items
        setGenderCategories(Array.from(new Set(allItems)));
      } catch (err) {
        console.error('Failed to fetch gender categories:', err);
      }
    };
    if (gender) fetchGenderCategories();
  }, [gender]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/products?gender=${gender}`, {
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Ensure strictly matching gender
        const matching = data.filter((p: any) => p.gender?.toLowerCase() === gender);
        
        setProducts(matching);
        setFiltered(matching);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setProducts([]);
          setFiltered([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (gender) fetchProducts();
    return () => controller.abort();
  }, [gender]);

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-10 pb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-stone-900">{gender}</span>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-stone-100 py-16 text-center shadow-[0_10px_40px_-20px_rgba(0,0,0,0.02)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400 mb-4">Collection</p>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 capitalize mb-4">{gender}</h1>
        <p className="text-sm text-stone-500">{loading ? 'Loading...' : `${sortedAndFiltered.length} styles`}</p>
      </div>

      {/* Category Pills & Sort */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-wrap gap-2.5 items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mr-2">Shop:</span>
          {genderCategories.map((cat: string) => (
            <Link
              key={cat}
              href={`/category/${gender}/${cat.toLowerCase().replace(/\s+/g, '')}`}
              className="px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest bg-white text-stone-500 border border-stone-200 hover:text-stone-900 hover:border-stone-900 transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="relative isolate" onMouseLeave={() => setIsSortOpen(false)}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2.5 pb-2 border-b border-stone-200 hover:border-stone-900 text-[10px] font-bold uppercase tracking-widest text-stone-900 transition-all min-w-[160px] justify-between group"
          >
            <span>{sortOption === 'featured' ? 'Featured' : sortOption === 'price-asc' ? 'Low to High' : 'High to Low'}</span>
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

      {/* Grid */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32"><div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-stone-400 text-sm mb-8">No pieces found.</p>
            <Link href="/" className="bg-stone-900 text-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-lg">Back Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {sortedAndFiltered.map((product: any) => (
              <ProductCard key={product._id || product.id} {...product} id={product._id || product.id} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-stone-300">...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
