"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { BASE_URL } from '@/utils/config';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) throw new Error('Failed to load products from server');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1400px] px-6 lg:px-12 py-32 text-center min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-2xl font-serif text-stone-900 animate-pulse tracking-wide">Loading collection...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1400px] px-6 lg:px-12 py-32 text-center min-h-[50vh] flex flex-col justify-center animate-fade-in">
        <div className="bg-red-50/50 border border-red-100 rounded-3xl p-12 max-w-2xl mx-auto shadow-sm">
          <h2 className="text-2xl font-serif text-red-700 mb-6">Database Connectivity Issue</h2>
          <div className="space-y-4 mb-8">
            <p className="text-stone-600 text-sm leading-relaxed">
              The frontend was unable to load products from your server at:
            </p>
            <code className="block bg-white px-4 py-3 rounded-xl border border-red-100 text-red-600 font-mono text-[13px] break-all">
              {BASE_URL}
            </code>
          </div>
          <div className="text-left space-y-4 text-xs text-stone-500 font-normal border-t border-red-100 pt-8">
            <p className="font-bold text-stone-700 uppercase tracking-widest text-[10px]">How to fix this:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>If testing <strong>locally</strong>: Ensure your backend is running on port 5001.</li>
              <li>If on <strong>Vercel</strong>: Change your <code>NEXT_PUBLIC_API_URL</code> to your Render URL (<code>https://...onrender.com/api</code>).</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products-grid" className="mx-auto max-w-[1400px] px-6 lg:px-12 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="max-w-xl">
          <span className="block text-[12px] font-medium uppercase tracking-[0.2em] text-stone-900/50 mb-4">Latest Additions</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight leading-tight">Quiet Luxury line</h2>
        </div>
        <Link href="/collection" className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-900 border-b border-stone-900/30 pb-1 hover:border-stone-900 transition-colors self-start md:self-auto group relative flex-shrink-0">
          View Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.slice(0, 8).map((product: any, idx: number) => {
          const productId = product._id || product.id;
          return (
            <div key={productId} className="opacity-0 animate-fade-up" style={{ animationDelay: `${0.1 * (idx % 4)}s` }}>
              <ProductCard {...product} id={productId} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
