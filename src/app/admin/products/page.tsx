"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2, Plus } from 'lucide-react';
import { BASE_URL } from '@/utils/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Deletion States
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter computation logic effect
  useEffect(() => {
    let result = products;

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(lowerQuery));
    }

    if (categoryFilter !== '') {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    setFilteredProducts(result);
  }, [searchQuery, categoryFilter, minPrice, maxPrice, products]);

  // Toast cleanup
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    const id = productToDelete._id || productToDelete.id;
    
    try {
      setIsDeleting(true);
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product from server');
      
      const updatedProducts = products.filter(p => (p._id || p.id) !== id);
      setProducts(updatedProducts);
      setProductToDelete(null);
      setToastMessage({ title: 'Product deleted successfully', type: 'success' });
    } catch (err: any) {
      setProductToDelete(null);
      setToastMessage({ title: err.message, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className="animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 animate-fade-up ${toastMessage.type === 'success' ? 'bg-stone-900 text-white' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {toastMessage.type === 'success' ? (
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-medium tracking-wide">{toastMessage.title}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-up">
            <h3 className="text-xl font-serif text-stone-900 mb-2">Delete Product</h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              Are you sure you want to delete <span className="font-semibold text-stone-900">{productToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
             >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-stone-900 mb-2">Products</h1>
          <p className="text-sm text-stone-500 font-normal">Manage your inventory, prices, and product details.</p>
        </div>
        <Link 
          href="/admin/add-product" 
          className="bg-stone-900 text-white px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] rounded-md hover:bg-stone-800 transition-colors shadow-[0_2px_10px_-4px_rgba(0,0,0,0.5)]"
        >
          Add Product
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50/50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8 text-sm font-medium">
          Error loading products: {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          
          {/* Filters Bar */}
          <div className="p-6 border-b border-stone-100 bg-stone-50/30 flex flex-col md:flex-row gap-4 items-center">
            {/* Search Name */}
            <div className="relative w-full md:flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search products by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200/80 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400 shadow-sm"
              />
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-48 relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`appearance-none w-full px-4 py-2.5 bg-white border border-stone-200/80 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal shadow-sm ${categoryFilter ? 'text-stone-900' : 'text-stone-400'}`}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={String(cat)} value={String(cat)}>{String(cat)}</option>
                ))}
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-xs">$</span>
                 <input 
                  type="number" 
                  step="0.01"
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-24 pl-6 pr-3 py-2.5 bg-white border border-stone-200/80 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400 shadow-sm"
                />
              </div>
              <span className="text-stone-400">-</span>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-xs">$</span>
                 <input 
                  type="number" 
                  step="0.01"
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24 pl-6 pr-3 py-2.5 bg-white border border-stone-200/80 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400 shadow-sm"
                />
              </div>
            </div>
            
            {/* Reset Filters */}
            {(searchQuery || categoryFilter || minPrice || maxPrice) && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap ml-2 font-medium bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stone-50/50 text-[#888888] font-medium text-xs tracking-wide">
                <tr>
                  <th className="px-8 py-5 font-medium uppercase tracking-wider w-20">Image</th>
                  <th className="px-8 py-5 font-medium uppercase tracking-wider">Name</th>
                  <th className="px-8 py-5 font-medium uppercase tracking-wider">Category</th>
                  <th className="px-8 py-5 font-medium uppercase tracking-wider">Price</th>
                  <th className="px-8 py-5 font-medium uppercase tracking-wider">Stock</th>
                  <th className="px-8 py-5 font-medium uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center text-stone-400 font-normal text-base">Loading product catalog...</td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const id = p._id || p.id;
                    return (
                      <tr key={id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden border border-stone-200/60 shadow-sm">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full bg-stone-100"></div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4 font-medium text-stone-900 tracking-tight">{p.name}</td>
                        <td className="px-8 py-4 text-stone-500 font-normal">{p.category}</td>
                        <td className="px-8 py-4 text-stone-900 font-normal">${p.price}</td>
                        <td className="px-8 py-4 text-stone-500 font-normal">
                          <span className={`px-2.5 py-1 ${p.stock && p.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} rounded-full text-[10px] font-medium uppercase tracking-widest`}>
                            {p.stock && p.stock > 0 ? p.stock : 'Out'}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-4 h-full">
                            <Link 
                              href={`/admin/edit-product/${id}`} 
                              className="text-[10px] font-medium uppercase tracking-widest text-[#888888] hover:text-stone-900 transition-colors"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => setProductToDelete(p)}
                              className="text-[10px] font-medium uppercase tracking-widest text-[#888888] hover:text-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center text-stone-400 font-normal">
                      No products found matching your current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
