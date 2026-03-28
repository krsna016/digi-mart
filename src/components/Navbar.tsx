"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryBanners: Record<string, { image: string, title: string, cta: string, path: string }> = {
  men: {
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&q=80&w=800',
    title: 'Modern Masculinity',
    cta: 'Shop Men',
    path: '/category/men'
  },
  women: {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    title: 'The Graceful Edit',
    cta: 'Shop Women',
    path: '/category/women'
  },
  kids: {
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800',
    title: 'Little Trendsetters',
    cta: 'Shop Kids',
    path: '/category/kids'
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
  const [categories, setCategories] = useState<any>({ men: {}, women: {}, kids: {} });
  const [isCatLoading, setIsCatLoading] = useState(true);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { BASE_URL } = await import('@/utils/config');
        console.log(`[Diagnostic] Navbar attempting to fetch from: ${BASE_URL}/categories`);
        
        const data = await api.get('/categories');
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn('[Diagnostic] No categories found in DB');
          setCategories({ men: {}, women: {}, kids: {} }); 
          return;
        }

        const transformed: any = { men: {}, women: {}, kids: {} };
        data.forEach((cat: any) => {
          const gender = cat.gender?.toLowerCase();
          if (gender && transformed[gender]) {
            transformed[gender][cat.group] = cat.items;
          }
        });
        setCategories(transformed);
      } catch (err) {
        console.error('[Diagnostic] Navbar category fetch failed:', err);
        setCategories({ men: {}, women: {}, kids: {} });
      } finally {
        setIsCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

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
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full px-6 md:px-12 lg:px-20 xl:px-32 pt-6 lg:pt-10 pointer-events-none">
      <header className={`pointer-events-auto w-full rounded-[2.5rem] transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl border border-white/40 shadow-premium' : 'bg-background/95 backdrop-blur-sm border border-stone-200 shadow-card'}`}>
        <div className="relative mx-auto max-w-[1440px] px-8 lg:px-12">
          <div className="absolute left-1/2 -translate-x-1/2 top-5 lg:top-7 z-50 text-center pointer-events-none">
            <Link 
              href="/" 
              className="group pointer-events-auto text-3xl lg:text-4xl font-serif tracking-tighter text-foreground select-none hover:tracking-wide hover:scale-105 hover:text-stone-700 transition-all duration-300 ease-in-out inline-block relative" 
              onClick={() => setMobileMenuOpen(false)}
            >
              DIGIMART
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 ease-in-out" />
            </Link>
          </div>

          <div className="flex h-16 lg:h-20 items-center justify-between">
            <div className="flex-1 flex items-center">
               <button
                className="lg:hidden p-2 -ml-2 text-foreground mr-4"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.2} /> : <Menu className="h-5 w-5" strokeWidth={1.2} />}
              </button>
              <div className="hidden lg:flex items-center pt-1">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-48 xl:w-64 bg-stone-200/20 hover:bg-stone-200/40 focus:bg-background border border-transparent focus:border-stone-300 rounded-full px-9 py-1.5 text-[13px] text-foreground placeholder:text-stone-500 transition-all duration-300 outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 group-focus-within:text-foreground transition-colors" strokeWidth={1.2} />
                </form>
              </div>
            </div>

            <div className="hidden lg:block w-32 xl:w-48" />

            <div className="flex-1 flex items-center justify-end gap-3 lg:gap-6 pt-1">
              <div ref={accountRef} className="relative hidden lg:block">
                <button 
                  onClick={() => {
                    if (mounted && !isAuthenticated) {
                      router.push('/login');
                    } else {
                      setIsAccountOpen(!isAccountOpen);
                    }
                  }}
                  className="flex items-center gap-2.5 p-1.5 text-stone-700 hover:text-foreground transition-all duration-300 group"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.2} />
                  {mounted && !isAuthenticated && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] hidden xl:inline-block border-b border-transparent group-hover:border-primary pb-0.5 transition-all">
                      Sign In
                    </span>
                  )}
                </button>

                <div className={`absolute top-full right-0 mt-3 w-56 bg-background border border-stone-200 rounded-3xl shadow-lg transition-all duration-300 transform origin-top-right overflow-hidden z-50 ${isAccountOpen && isAuthenticated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                  {mounted && isAuthenticated && (
                    <div className="py-2">
                      <div className="px-6 py-4 border-b border-stone-50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 mb-1">Signed in as</p>
                        <p className="text-[20px] font-medium text-foreground truncate font-serif">{user?.name || user?.email}</p>
                      </div>
                      <div className="py-2 border-b border-stone-50">
                        <Link href="/account" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:text-foreground hover:bg-background-alt/50 transition-all group">My Account</Link>
                        <Link href="/orders" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:text-foreground hover:bg-background-alt/50 transition-all group">Orders</Link>
                        {user?.role === 'admin' && (
                          <Link href="/admin" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:bg-background-alt/50 transition-all group">Admin Dashboard</Link>
                        )}
                      </div>
                      <div className="pt-2">
                        <button onClick={() => { logout(); setIsAccountOpen(false); }} className="w-full text-left px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-red-500 hover:bg-red-50/20 transition-all">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Link href="/wishlist" className="relative p-1.5 text-stone-700 hover:text-foreground transition-all duration-300 hover:scale-105">
                <Heart className={`w-5 h-5 transition-colors ${mounted && wishlistCount > 0 ? 'fill-primary text-primary' : ''}`} strokeWidth={1.2} />
                {mounted && wishlistCount > 0 && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center rounded-full border border-background animate-pulse">{wishlistCount}</span>}
              </Link>
              <Link href="/cart" className="relative p-1.5 text-stone-700 hover:text-foreground transition-all duration-300 hover:scale-105">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.2} />
                {mounted && cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground ring-2 ring-background">{cartCount > 9 ? '9+' : cartCount}</span>}
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex h-14 items-center justify-center -mt-1 pt-2">
            <nav className="flex gap-12 items-center justify-center">
              {['men', 'women', 'kids'].map((mainCat) => (
                <div key={mainCat} className="h-full flex items-center relative" onMouseEnter={() => setHoveredCategory(mainCat)} onMouseLeave={() => setHoveredCategory(null)}>
                  <Link href={`/category/${mainCat}`} className="relative h-full flex items-center py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-700 hover:text-foreground transition-all duration-500 group">
                    {mainCat}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-primary transition-all duration-500 ease-in-out ${hoveredCategory === mainCat ? 'w-full' : 'w-0'}`} />
                  </Link>
                  <AnimatePresence>
                    {hoveredCategory === mainCat && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[1000px] max-w-[90vw] z-50 pointer-events-auto">
                        <div className="bg-background border border-stone-200 shadow-[0_40px_100px_-25px_rgba(0,0,0,0.18)] rounded-3xl overflow-hidden grid grid-cols-12">
                          <div className="col-span-9 p-14 pr-8">
                            <div className="flex flex-col gap-12">
                              <div className="flex flex-col gap-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Essential Edit</p>
                                <h3 className="text-5xl font-serif text-foreground capitalize tracking-tight">The {mainCat}&rsquo;s Collection</h3>
                              </div>
                              <div className="flex flex-wrap gap-x-16 gap-y-12">
                                {categories[mainCat] && Object.entries(categories[mainCat]).map(([group, items]: [string, any]) => (
                                  <div key={group} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                      <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-foreground">{group}</span>
                                      <div className="h-[1px] w-6 bg-primary/10" />
                                    </div>
                                    <div className="flex flex-col gap-3.5">
                                      {items.map((sub: string) => (
                                        <Link key={sub} href={`/category/${mainCat}/${sub.toLowerCase().replace(/\s+/g, '')}`} className="group/sub text-[15px] font-normal text-stone-500 hover:text-foreground transition-all duration-300 flex items-center justify-between" onClick={() => setHoveredCategory(null)}>
                                          <span className="capitalize">{sub}</span>
                                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-300" strokeWidth={1.5} />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-16 pt-8 border-t border-stone-200 flex items-center justify-between">
                              <Link href={`/category/${mainCat}`} className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground flex items-center gap-2 group/all transition-all duration-300" onClick={() => setHoveredCategory(null)}>View full {mainCat} collection <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" strokeWidth={2} /></Link>
                              <div className="flex gap-8 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500"><span>Free Shipping Over ₹150</span><span>Easy Returns</span></div>
                            </div>
                          </div>
                          <div className="col-span-3 relative group/banner overflow-hidden border-l border-stone-200/50">
                            <img src={categoryBanners[mainCat as keyof typeof categoryBanners]?.image} alt={mainCat} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/banner:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-700" />
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-10 text-center">
                              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/90 mb-3 drop-shadow-sm">Seasonal Choice</p>
                              <h4 className="text-xl font-serif text-white mb-8 leading-tight drop-shadow-md">{categoryBanners[mainCat as keyof typeof categoryBanners]?.title}</h4>
                              <Link href={categoryBanners[mainCat as keyof typeof categoryBanners]?.path} className="w-full py-4 bg-background/95 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-background transition-all shadow-xl active:scale-[0.98]" onClick={() => setHoveredCategory(null)}>{categoryBanners[mainCat as keyof typeof categoryBanners]?.cta} →</Link>
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} 
            className="fixed inset-0 z[60] bg-background lg:hidden flex flex-col h-full"
          >
            <div className="flex items-center justify-between p-8 border-b border-stone-200 mt-4">
              <Link href="/" className="text-2xl font-serif text-foreground" onClick={() => setMobileMenuOpen(false)}>DIGIMART</Link>
              <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-foreground" strokeWidth={1.5} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 py-6 pb-40">
              <form onSubmit={handleSearch} className="mb-12 relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-stone-100 px-10 py-4 text-sm rounded-full outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" strokeWidth={1.5} />
              </form>

              <div className="space-y-12">
                {['men', 'women', 'kids'].map((mainCat) => (
                  <div key={mainCat} className="space-y-6">
                    <button 
                      onClick={() => setExpandedCategory(expandedCategory === mainCat ? null : mainCat)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="text-4xl font-serif text-foreground capitalize">{mainCat}</span>
                      <ArrowRight className={`w-6 h-6 text-stone-500 transition-transform duration-500 ${expandedCategory === mainCat ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedCategory === mainCat && (
                      <div className="space-y-10 pl-4 border-l border-stone-200">
                        {categories[mainCat] && Object.entries(categories[mainCat]).map(([group, items]: [string, any]) => (
                          <div key={group} className="space-y-4">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{group}</p>
                            <div className="flex flex-col gap-4">
                              {items.map((sub: string) => (
                                <Link
                                  key={sub}
                                  href={`/category/${mainCat}/${sub.toLowerCase().replace(/\s+/g, '')}`}
                                  className="text-[15px] font-medium text-foreground"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-12 border-t border-stone-200">
                {isAuthenticated ? (
                  <div className="space-y-6">
                    <Link href="/account" className="block text-lg font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block text-lg font-medium text-red-500">Logout</button>
                  </div>
                ) : (
                  <Link href="/login" className="block text-lg font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
