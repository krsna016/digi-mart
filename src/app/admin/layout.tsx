import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FBFBFB] font-sans text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col flex-shrink-0 shadow-sm z-10">
        <div className="h-20 flex items-center px-8 border-b border-stone-200">
          <span className="font-serif text-xl tracking-tight font-medium text-stone-900">
            DIGIMART ADMIN
          </span>
        </div>
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          <Link href="/admin" className="px-4 py-3 text-sm font-medium rounded-md bg-stone-100 text-stone-900 hover:bg-stone-200/50 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="px-4 py-3 text-sm font-medium rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Products
          </Link>
          <Link href="/admin/add-product" className="px-4 py-3 text-sm font-medium rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Add Product
          </Link>
        </nav>
        <div className="p-6 border-t border-stone-200">
          <Link href="/" className="px-4 py-2 block text-xs uppercase tracking-widest font-medium text-stone-400 hover:text-stone-900 transition-colors">
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-stone-200 flex flex-shrink-0 items-center justify-end px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-xs font-medium text-white shadow-sm">
              AD
            </div>
            <span className="text-sm font-medium tracking-wide">Admin</span>
          </div>
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
