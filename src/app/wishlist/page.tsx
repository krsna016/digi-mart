"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { Trash2, Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24 animate-fade-in">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-600 mb-4">Your Library</p>
          <h1 className="text-4xl lg:text-6xl font-serif text-stone-900 tracking-tight mb-6">Wishlist</h1>
          <div className="h-px w-20 bg-stone-200 mx-auto mb-6" />
          <p className="text-sm font-normal text-stone-500 italic">
            {wishlistCount === 0 
              ? "Your collection is waiting to be started." 
              : `You have ${wishlistCount} ${wishlistCount === 1 ? 'piece' : 'pieces'} saved.`}
          </p>
        </div>

        {wishlistCount === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-stone-100 rounded-full scale-150 opacity-50 blur-2xl" />
              <Heart className="w-16 h-16 text-stone-200 relative z-10" strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-4">Your wishlist is empty</h2>
            <p className="text-stone-500 font-normal mb-10 max-w-md mx-auto leading-relaxed">
              Explore our curated collections and save your favorite pieces here for later.
            </p>
            <Link 
              href="/" 
              className="bg-stone-900 text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-stone-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 animate-fade-up">
            {wishlist.map((product) => (
              <div key={product.id} className="group relative">
                <ProductCard {...product} />
                
                {/* Explicit Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                  className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 hover:text-red-500 transition-colors duration-300 py-1"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Remove Item</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
