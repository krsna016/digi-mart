"use client";

import { useAuth } from '@/context/AuthContext';
import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const AUTO_LOGOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Strict';
    router.push('/login');
  };

  // Ensure cookie is set for admin users (fix for existing sessions)
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin && user?.token) {
      const hasCookie = document.cookie.includes('admin_token=');
      if (!hasCookie) {
        document.cookie = `admin_token=${user.token}; path=/; max-age=86400; SameSite=Strict`;
      }
    }
  }, [isAuthenticated, isAdmin, user, isLoading]);

  // Auto-logout on inactivity
  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Strict';
        router.push('/login');
      }, AUTO_LOGOUT_DURATION);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [router]);

  return (
    <div className="flex h-screen bg-[#FBFBFB] font-sans text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col flex-shrink-0 shadow-sm z-10">
        <div className="h-20 flex items-center px-8 border-b border-stone-200">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <span className="font-serif text-xl tracking-tight font-medium text-stone-900">
              DIGIMART ADMIN
            </span>
          </Link>
        </div>
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          <Link 
            href="/admin" 
            className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${pathname === '/admin' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/products') ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
          >
            Products
          </Link>
          <Link 
            href="/admin/add-product" 
            className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/add-product' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
          >
            Add Product
          </Link>
          <Link 
            href="/admin/categories" 
            className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/categories' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
          >
            Categories
          </Link>
        </nav>
        <div className="p-6 border-t border-stone-200 flex flex-col gap-3">
          <Link href="/" className="px-4 py-2 block text-xs uppercase tracking-widest font-medium text-stone-400 hover:text-stone-900 transition-colors">
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-stone-200 flex flex-shrink-0 items-center justify-end px-10 sticky top-0 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-stone-400 hover:text-red-600 transition-colors duration-200 group"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        <div className="flex-1 overflow-auto p-10">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
