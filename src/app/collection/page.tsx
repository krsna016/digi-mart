"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category')?.toLowerCase() || '';

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(r => { if (!r.ok) throw new Error('Failed to load products'); return r.json(); })
      .then(data => setAllProducts(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = categoryFilter
    ? allProducts.filter(p => 
        p.mainCategory?.toLowerCase() === categoryFilter ||
        (!p.mainCategory && p.category?.toLowerCase() === categoryFilter)
      )
    : allProducts;

  // Sorting Logic
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    return 0; 
  });

  const title = categoryFilter
    ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}'s Collection`
    : 'All Collection';

  const categories = [...new Set(allProducts.map(p => p.mainCategory || p.category).filter(Boolean))];

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />

      {/* Premium Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-10 pb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <Link href="/collection" className={`transition-colors ${!categoryFilter ? 'text-stone-900' : 'hover:text-stone-900'}`}>Collection</Link>
        {categoryFilter && (
          <>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900">{categoryFilter}</span>
          </>
        )}
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-stone-100 py-16 lg:py-20 text-center animate-fade-in relative z-10 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.03)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400 mb-4">Digimart</p>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-5">{title}</h1>
        <p className="text-sm font-normal text-stone-500 transition-opacity duration-300">
          {loading ? 'Finding pieces...' : `${sortedAndFiltered.length} Results`}
        </p>
      </div>

      {/* Control Bar: Filters & Sort */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-30">
        
        {/* Category Pills */}
        <div className="flex-1">
          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/collection"
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm border border-transparent hover:scale-[1.02] active:scale-[0.98] ${!categoryFilter ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:text-stone-900 hover:border-stone-200'}`}
              >
                All
              </Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat}
                  href={`/collection?category=${encodeURIComponent(cat.toLowerCase())}`}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm border border-transparent hover:scale-[1.02] active:scale-[0.98] ${categoryFilter === cat.toLowerCase() ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:text-stone-900 hover:border-stone-200'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sort Premium Dropdown */}
        {!loading && sortedAndFiltered.length > 0 && (
          <div className="relative isolate" onMouseLeave={() => setIsSortOpen(false)}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2.5 pb-2 border-b border-stone-200 hover:border-stone-900 text-[10px] font-bold uppercase tracking-widest text-stone-900 transition-all duration-300 min-w-[200px] justify-between group"
            >
              <div>
                <span className="text-stone-400 font-medium mr-2">Sort:</span>
                <span className="group-hover:opacity-60 transition-opacity">
                  {sortOption === 'featured' ? 'Featured' : sortOption === 'price-asc' ? 'Low to High' : 'High to Low'}
                </span>
              </div>
              <svg className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Box */}
            <div className={`absolute top-full right-0 pt-3 w-56 transition-all duration-300 transform origin-top-right ${isSortOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible translate-y-2 pointer-events-none'}`}>
              <div className="bg-white border border-stone-200/60 rounded-2xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col p-2 gap-0.5">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' }
                ].map(opt => (
                   <button 
                    key={opt.id}
                    onClick={() => { setSortOption(opt.id as SortOption); setIsSortOpen(false); }}
                    className={`text-left px-5 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between ${sortOption === opt.id ? 'bg-stone-50 text-stone-900' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50/50'}`}
                  >
                    {opt.label}
                    {sortOption === opt.id && (
                      <svg className="w-3.5 h-3.5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-10 z-10 transition-all duration-500 ease-in-out">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-up">
            <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
            <p className="text-stone-400 text-xs font-normal">Ensure your backend is running on port 5001.</p>
          </div>
        ) : sortedAndFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-up">
            <svg className="w-12 h-12 text-stone-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4M8 16l-4-4 4-4" /></svg>
            <p className="text-stone-400 text-sm font-normal mb-8">No pieces found matching your criteria.</p>
            <Link href="/collection" className="bg-stone-900 text-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-stone-800 transition-colors shadow-sm">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
            {sortedAndFiltered.map((product: any, idx: number) => (
              <div
                key={`${product._id || product.id}-${sortOption}`} // Unique key to force re-render transition on sort
                className="opacity-0 animate-fade-up transition-transform duration-700 ease-out hover:-translate-y-1.5"
                style={{ animationDelay: `${0.04 * idx}s` }}
              >
                <ProductCard {...product} id={product._id || product.id} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
