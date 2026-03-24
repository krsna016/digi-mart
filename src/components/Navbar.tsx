"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { categoryConfig } from '@/data/categoryConfig';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryBanners: Record<string, { image: string, title: string, cta: string, path: string }> = {
  apparel: {
    image: '/images/banners/apparel.png',
    title: 'The Modern Essentials',
    cta: 'Shop Apparel',
    path: '/category/apparel'
  },
  accessories: {
    image: '/images/banners/accessories.png',
    title: 'Refined Accents',
    cta: 'Shop Accessories',
    path: '/category/accessories'
  },
  home: {
    image: '/images/banners/home.png',
    title: 'Nurture Your Space',
    cta: 'Shop Home',
    path: '/category/home'
  },
  decor: {
    image: '/images/banners/decor.png',
    title: 'Elevate Your Space',
    cta: 'Shop Decor',
    path: '/category/decor'
  },
  kitchen: {
    image: '/images/banners/kitchen.png',
    title: 'Culinary Craft',
    cta: 'Shop Kitchen',
    path: '/category/kitchen'
  }
};

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sticky scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  // Close account dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-[#FCFBF8] transition-all duration-300 ${scrolled ? 'shadow-[0_4px_25px_-12px_rgba(0,0,0,0.08)]' : ''}`}>
        
        {/* Main Navbar Container */}
        <div className="relative mx-auto max-w-[1440px] px-8 lg:px-12 border-b border-stone-200/50">
          
          {/* Logo - Centered and Spanning both rows */}
          <div className="absolute left-1/2 -translate-x-1/2 top-5 lg:top-7 z-50 text-center pointer-events-none">
            <Link 
              href="/" 
              className="group pointer-events-auto text-3xl lg:text-4xl font-serif tracking-tighter text-stone-900 select-none hover:tracking-wide hover:scale-105 hover:text-stone-700 transition-all duration-300 ease-in-out inline-block relative" 
              onClick={() => setMobileMenuOpen(false)}
            >
              DIGIMART
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-700 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 ease-in-out" />
            </Link>
          </div>

          {/* Row 1: Top Utility Bar */}
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Left: Search Bar (Desktop) / Mobile Menu (Mobile) */}
            <div className="flex-1 flex items-center">
               <button
                className="lg:hidden p-2 -ml-2 text-stone-900 mr-4"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.2} /> : <Menu className="h-5 w-5" strokeWidth={1.2} />}
              </button>

              {/* Desktop Search Bar */}
              <div className="hidden lg:flex items-center pt-1">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-48 xl:w-64 bg-stone-100/60 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-200 rounded-md px-9 py-1.5 text-[13px] text-stone-900 placeholder:text-stone-600 transition-all duration-300 outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-stone-900 transition-colors" strokeWidth={1.2} />
                </form>
              </div>
            </div>

            {/* Middle: Logo is absolute positioned, so Row 1 center is implicitly handled */}
            <div className="hidden lg:block w-32 xl:w-48" />

            {/* Right: Utility Icons */}
            <div className="flex-1 flex items-center justify-end gap-3 lg:gap-6 pt-1">
              {/* Account Dropdown */}
              <div ref={accountRef} className="relative hidden lg:block">
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center p-1.5 text-stone-600 hover:text-stone-900 transition-colors duration-300"
                  aria-label="Account menu"
                >
                  <User className="w-5 h-5" strokeWidth={1.2} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full right-0 mt-3 w-56 bg-white border border-stone-100 rounded-md shadow-lg transition-all duration-300 transform origin-top-right overflow-hidden z-50 ${isAccountOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                  {mounted && isAuthenticated ? (
                    /* Authenticated State */
                    <div className="py-2">
                      <div className="px-6 py-4 border-b border-stone-50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 mb-1">Signed in as</p>
                        <p className="text-[14px] font-medium text-stone-900 truncate font-serif">{user?.name || user?.email}</p>
                      </div>
                      <div className="py-2 border-b border-stone-50">
                        <Link 
                          href="/account" 
                          onClick={() => setIsAccountOpen(false)} 
                          className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:text-stone-900 hover:bg-stone-50/50 transition-all group"
                        >
                          My Account
                          <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link 
                          href="/orders" 
                          onClick={() => setIsAccountOpen(false)} 
                          className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:text-stone-900 hover:bg-stone-50/50 transition-all group"
                        >
                          Orders
                          <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {user?.role === 'admin' && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsAccountOpen(false)} 
                            className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 hover:bg-stone-50/50 transition-all group"
                          >
                            Admin Dashboard
                            <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => { logout(); setIsAccountOpen(false); }}
                          className="w-full text-left px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-red-500 hover:bg-red-50/20 transition-all"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Guest State */
                    <div className="p-2 flex flex-col gap-1">
                      <Link 
                        href="/login" 
                        onClick={() => setIsAccountOpen(false)}
                        className="w-full text-center py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-all"
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/signup" 
                        onClick={() => setIsAccountOpen(false)}
                        className="w-full text-center py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:text-stone-900 transition-all"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Search Icon */}
              <button className="lg:hidden p-1.5 text-stone-700 hover:text-stone-900 transition-colors">
                 <Search className="w-5 h-5" strokeWidth={1.2} />
              </button>

              {/* Wishlist Icon */}
              <Link href="/wishlist" title="Wishlist" className="relative p-1.5 text-stone-600 hover:text-stone-900 transition-all duration-300 hover:scale-105">
                <Heart className={`w-5 h-5 transition-colors ${mounted && wishlistCount > 0 ? 'fill-stone-900 text-stone-900' : ''}`} strokeWidth={1.2} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-stone-900 text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" title="Cart" className="relative p-1.5 text-stone-600 hover:text-stone-900 transition-all duration-300 hover:scale-105">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.2} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[8px] font-bold text-white ring-2 ring-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Row 2: Category Bar (Desktop Only) */}
          <div className="hidden lg:flex h-14 items-center justify-center -mt-1 pt-2">
            <nav className="flex gap-12 items-center justify-center">
              {Object.keys(categoryConfig).map((mainCat) => (
                <div
                  key={mainCat}
                  className="h-full flex items-center relative"
                  onMouseEnter={() => setHoveredCategory(mainCat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/category/${mainCat}`}
                    className="relative h-full flex items-center py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-600 hover:text-stone-900 transition-all duration-500 group"
                  >
                    {mainCat}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-stone-900 transition-all duration-500 ease-in-out ${hoveredCategory === mainCat ? 'w-full' : 'w-0'}`} />
                  </Link>

                  {/* Mega Menu - Refined UI */}
                  <AnimatePresence>
                    {hoveredCategory === mainCat && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[850px] z-50 pointer-events-auto"
                      >
                        <div className="bg-white border border-stone-100 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden grid grid-cols-12">
                          
                          {/* Left: Content Area */}
                          <div className="col-span-8 p-10 pr-6">
                            <div className="flex flex-col gap-10">
                              <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Collection</p>
                                <h3 className="text-2xl font-serif text-stone-900 capitalize tracking-tight">{mainCat}</h3>
                              </div>

                              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                                {Object.entries((categoryConfig as any)[mainCat]).map(([cat, subcats]: [string, any]) => (
                                  <div key={cat} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">General</p>
                                      <Link
                                        href={`/category/${mainCat}?cat=${encodeURIComponent(cat)}`}
                                        className="text-[13px] font-bold uppercase tracking-[0.15em] text-stone-900 hover:text-stone-600 transition-colors duration-300"
                                        onClick={() => setHoveredCategory(null)}
                                      >
                                        {cat}
                                      </Link>
                                    </div>
                                    <div className="h-px w-8 bg-stone-100" />
                                    <div className="flex flex-col gap-4">
                                      {subcats.map((sub: string) => (
                                        <Link
                                          key={sub}
                                          href={`/category/${mainCat}?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`}
                                          className="group/sub text-[13px] font-normal text-stone-600 hover:text-stone-900 hover:translate-x-1 transition-all duration-300 flex items-center justify-between"
                                          onClick={() => setHoveredCategory(null)}
                                        >
                                          <span className="capitalize">{sub}</span>
                                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-300" strokeWidth={1.5} />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-stone-50">
                              <Link 
                                href={`/category/${mainCat}`} 
                                className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900 flex items-center gap-2 group/all transition-all duration-300"
                                onClick={() => setHoveredCategory(null)}
                              >
                                View full {mainCat} collection
                                <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" strokeWidth={2} />
                              </Link>
                            </div>
                          </div>

                          {/* Right: Visual Banner */}
                          <div className="col-span-4 relative group/banner overflow-hidden">
                            <img 
                              src={categoryBanners[mainCat as keyof typeof categoryBanners]?.image || categoryBanners['apparel'].image} 
                              alt={mainCat}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/banner:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover/banner:bg-black/30 transition-colors duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-10 pb-12 text-center">
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 mb-2">Editor's Pick</p>
                              <h4 className="text-2xl font-serif text-white mb-6 leading-tight">
                                {categoryBanners[mainCat as keyof typeof categoryBanners]?.title || 'Elevate Your Life'}
                              </h4>
                              <Link 
                                href={categoryBanners[mainCat as keyof typeof categoryBanners]?.path || '/collection'}
                                className="w-full py-4 bg-white text-stone-900 text-[11px] font-bold uppercase tracking-[0.2em] rounded-md hover:bg-stone-50 transition-all shadow-lg active:scale-95"
                                onClick={() => setHoveredCategory(null)}
                              >
                                {categoryBanners[mainCat as keyof typeof categoryBanners]?.cta || 'Shop Now'} →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Maintained logic */}
      <div className={`fixed inset-0 z-40 bg-[#FCFBF8] transition-transform duration-500 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-24 px-8 pb-4 border-b border-stone-100">
          <form onSubmit={handleSearch} className="flex items-center gap-3 bg-stone-100 rounded-lg px-4 py-3">
            <Search className="w-4 h-4 text-stone-600" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-700 outline-none font-normal"
            />
          </form>
        </div>

        <div className="px-8 h-full overflow-y-auto pb-32 pt-6">
          <div className="flex flex-col gap-6">
            {Object.entries(categoryConfig).map(([mainCat, cats]) => (
              <div key={mainCat} className="border-b border-stone-100 pb-6">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === mainCat ? null : mainCat)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-3xl font-serif text-stone-900 capitalize">{mainCat}</span>
                  <svg className={`w-5 h-5 text-stone-600 transition-transform duration-500 ${expandedCategory === mainCat ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedCategory === mainCat ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col gap-6 pl-4 border-l border-stone-200 ml-2">
                    {Object.entries(cats).map(([cat, subcats]) => (
                      <div key={cat} className="flex flex-col gap-3">
                        <Link
                          href={`/category/${mainCat}?cat=${encodeURIComponent(cat)}`}
                          className="text-[12px] font-bold uppercase tracking-[0.2em] text-stone-900 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat}
                        </Link>
                        <div className="flex flex-col gap-2 pl-3">
                          {subcats.map(sub => (
                            <Link
                              key={sub}
                              href={`/category/${mainCat}?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`}
                              className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-700 hover:text-stone-900 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
