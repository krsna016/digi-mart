"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error('Search fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (query && products.length > 0) {
      const results = products.filter((p: any) => 
        p.name?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.gender?.toLowerCase().includes(query)
      );
      setFiltered(results);
    } else {
      setFiltered(products);
    }
  }, [query, products]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 pt-10 pb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-stone-400">/</span>
        <span className="text-foreground">Search</span>
      </div>

      {/* Hero */}
      <div className="bg-background border-b border-stone-200 py-16 text-center shadow-[0_10px_40px_-20px_rgba(0,0,0,0.02)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-500 mb-4">Search Results</p>
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          {query ? `Results for "${query}"` : "All Collection"}
        </h1>
        <p className="text-sm text-stone-500">
          {loading ? 'Searching universe...' : `${filtered.length} styles found`}
        </p>
      </div>

      {/* Grid */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-900 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-[10px] font-bold uppercase tracking-widest border-b border-stone-900 pb-1">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 animate-fade-up">
            <p className="text-stone-500 text-sm mb-8 font-light italic">No pieces found matching your criteria.</p>
            <Link href="/collection" className="bg-primary text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-stone-800 transition-all shadow-lg active:scale-[0.98]">
              Browse All Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {filtered.map((product: any, idx: number) => (
              <div key={product._id || product.id} className="opacity-0 animate-fade-up" style={{ animationDelay: `${0.05 * idx}s` }}>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-stone-400">...</div>}>
      <SearchContent />
    </Suspense>
  );
}
