"use client";

import Link from 'next/link';
import ProductCard from './ProductCard';

export default function ProductGrid({ 
  title = "Quiet Luxury line", 
  subtitle = "Latest Additions",
  products = []
}: { 
  title?: string, 
  subtitle?: string,
  products?: any[]
}) {

  if (!products || products.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] w-full px-4 text-center min-h-[50vh] flex flex-col justify-center animate-fade-in">
        <div className="bg-background-alt border border-stone-200 rounded-[2.5rem] p-12 max-w-2xl mx-auto shadow-sm">
          <h2 className="text-2xl font-serif text-foreground mb-6">No Products Available</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            We couldn't load any products right now. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products-grid" className="w-full bg-background p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-premium border border-stone-200/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="max-w-xl">
          <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight leading-tight">{title}</h2>
        </div>
        <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors self-start md:self-auto group relative flex-shrink-0">
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
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
