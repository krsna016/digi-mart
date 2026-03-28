"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { BASE_URL } from '@/utils/config';

export default function AllCollectionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/products`)
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-background border-b border-stone-200 py-16 text-center animate-fade-in">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-500 mb-3">Digimart</p>
        <h1 className="text-5xl font-serif text-foreground mb-3">All Collection</h1>
        <p className="text-sm font-normal text-stone-500">{loading ? '' : `${products.length} items`}</p>
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-900 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-stone-500 text-sm font-normal">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
            {products.map((product: any, idx: number) => (
              <div
                key={product._id || product.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.05 * (idx % 8)}s` }}
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
