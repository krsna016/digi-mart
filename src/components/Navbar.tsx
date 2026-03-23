"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-[#FCFBF8]/80 backdrop-blur-md transition-all animate-fade-in">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-12">
        <div className="flex flex-1 items-center justify-start">
          <button className="lg:hidden p-2 -ml-2 text-stone-900">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav className="hidden lg:flex gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-900/70">
            <Link href="#" className="hover:text-stone-900 transition-colors duration-300">Women</Link>
            <Link href="#" className="hover:text-stone-900 transition-colors duration-300">Men</Link>
            <Link href="#" className="hover:text-stone-900 transition-colors duration-300">Home</Link>
          </nav>
        </div>
        
        <Link href="/" className="text-3xl font-serif tracking-tight text-stone-900 mt-1">
          DIGIMART
        </Link>
        
        <div className="flex flex-1 items-center justify-end gap-8 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-900/70">
          <Link href="#" className="hidden sm:block hover:text-stone-900 transition-colors duration-300">Account</Link>
          <Link href="/cart" className="flex items-center gap-2 hover:text-stone-900 transition-colors duration-300 group">
            <span>Cart</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-stone-900/5 text-[9px] text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-300">
              {mounted ? cartCount : 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
