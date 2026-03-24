"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { categoryConfig } from '@/data/categoryConfig';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';

type SortOption = 'featured' | 'price-asc' | 'price-desc';

// Separate the main content into a sub-component to use Suspense
function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryName = (params.name as string)?.toLowerCase();
  const activeCat = searchParams.get('cat') || '';
  const activeSub = searchParams.get('sub') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const mainCategoryData = (categoryConfig as any)[categoryName] || null;
  const categoriesInMain = mainCategoryData ? Object.keys(mainCategoryData) : [];
  const subcategoriesInActiveCat = (mainCategoryData && activeCat) ? mainCategoryData[activeCat] || [] : [];

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products from backend...');
        const res = await fetch(`${BASE_URL}/products`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        console.log(`Received ${data.length} products`);

        // Filter by mainCategory (primary match)
        const matching = data.filter((p: any) =>
          p.mainCategory?.toLowerCase() === categoryName ||
          (p.category?.toLowerCase() === categoryName && !p.mainCategory)
        );
        
        setProducts(matching);
        setFiltered(matching);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', err);
          setProducts([]);
          setFiltered([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
    }

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [categoryName]);

  // Filter by sub when activeSub changes
  useEffect(() => {
    let result = products;
    
    if (activeCat) {
      result = result.filter(p => p.category?.toLowerCase() === activeCat.toLowerCase());
    }
    
    if (activeSub) {
      result = result.filter(p =>
        p.subcategory?.toLowerCase() === activeSub.toLowerCase() ||
        p.name?.toLowerCase().includes(activeSub.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeCat, activeSub, products]);

  // Handle distinct sort state
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />

      {/* Premium Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-10 pb-4 flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <Link href="/collection" className="hover:text-stone-900 transition-colors">Collection</Link>
        <span className="text-stone-300">/</span>
        <Link href={`/category/${categoryName}`} className={`transition-colors ${(!activeCat && !activeSub) ? 'text-stone-900' : 'hover:text-stone-900'}`}>{categoryName}</Link>
        {activeCat && (
          <>
            <span className="text-stone-300">/</span>
            <Link href={`/category/${categoryName}?cat=${encodeURIComponent(activeCat)}`} className={`transition-colors ${!activeSub ? 'text-stone-900' : 'hover:text-stone-900'}`}>{activeCat}</Link>
          </>
        )}
        {activeSub && (
          <>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900">{activeSub}</span>
          </>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-white border-b border-stone-100 py-16 lg:py-20 text-center animate-fade-in relative z-10 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.03)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400 mb-4">Shop Collection</p>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 capitalize mb-4">
          {activeSub || activeCat || categoryName}
        </h1>
        <p className="text-sm font-normal text-stone-500 transition-opacity duration-300">
          {loading ? 'Discovering styles...' : `${sortedAndFiltered.length} styles found`}
        </p>
      </div>

       {/* Control Bar: Subcategory Pills & Sort */}
       <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-30">
        
        {/* Filters */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Categories in Main */}
          {categoriesInMain.length > 0 && (
            <div className="flex flex-wrap gap-2.5 items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mr-2">Category:</span>
              <Link
                href={`/category/${categoryName}`}
                className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 border ${!activeCat ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200 hover:text-stone-900'}`}
              >
                All
              </Link>
              {categoriesInMain.map(cat => (
                <Link
                  key={cat}
                  href={`/category/${categoryName}?cat=${encodeURIComponent(cat)}`}
                  className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeCat === cat ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200 hover:text-stone-900'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {/* Subcategories (Dynamic) */}
          {subcategoriesInActiveCat.length > 0 && (
            <div className="flex flex-wrap gap-2.5 items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mr-2">Subcategory:</span>
              <Link
                href={`/category/${categoryName}?cat=${encodeURIComponent(activeCat)}`}
                className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 border ${!activeSub ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-400 border-stone-100 hover:text-stone-900'}`}
              >
                All
              </Link>
              {subcategoriesInActiveCat.map((sub: string) => (
                <Link
                  key={sub}
                  href={`/category/${categoryName}?cat=${encodeURIComponent(activeCat)}&sub=${encodeURIComponent(sub)}`}
                  className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeSub === sub ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-400 border-stone-100 hover:text-stone-900'}`}
                >
                  {sub}
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

      {/* Products Grid */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-10 z-10 transition-all duration-500 ease-in-out">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-up">
            <svg className="w-12 h-12 text-stone-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4M8 16l-4-4 4-4" /></svg>
            <p className="text-stone-400 text-sm font-normal mb-8">No pieces found in this category yet.</p>
            <Link href="/" className="bg-stone-900 text-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-stone-800 transition-colors shadow-sm">
              &larr; Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
            {sortedAndFiltered.map((product: any, idx: number) => {
              const id = product._id || product.id;
              return (
                <div 
                  key={`${id}-${sortOption}`}
                  className="animate-fade-up transition-transform duration-700 ease-out hover:-translate-y-1.5"
                  style={{ animationDelay: `${0.04 * idx}s` }}
                >
                  <ProductCard {...product} id={id} />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#FCFBF8]">
        <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
