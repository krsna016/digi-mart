"use client";

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Plus, X, Save, Trash2, ChevronRight, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGender, setActiveGender] = useState<'men' | 'women' | 'kids'>('men');
  const [newGroupName, setNewGroupName] = useState('');
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { BASE_URL } = await import('@/utils/config');
      console.log(`[Diagnostic] Admin Categories fetching from: ${BASE_URL}/categories`);
      
      const data = await api.get('/categories');
      console.log(`[Diagnostic] Received ${data?.length || 0} categories`);
      setCategories(data);
    } catch (err) {
      console.error('[Diagnostic] Admin Categories fetch failed:', err);
      showToast('Failed to fetch categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      showToast('Please enter a group name', 'error');
      return;
    }
    try {
      await api.post('/categories', {
        gender: activeGender,
        group: newGroupName.trim(),
        items: []
      });
      setNewGroupName('');
      fetchCategories();
      showToast(`${newGroupName} group created for ${activeGender}`, 'success');
    } catch (err: any) {
      console.error('[Diagnostic] Group creation failed:', err);
      showToast(err.message || 'Failed to create group. Check if it already exists.', 'error');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Are you sure? This will remove the entire group and its varieties.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      showToast('Group removed', 'success');
    } catch (err) {
      showToast('Failed to remove group', 'error');
    }
  };

  const handleAddItem = async (groupId: string, currentItems: string[]) => {
    const newItem = prompt('Enter new variety name (e.g. Linen Shirts):');
    if (!newItem || !newItem.trim()) return;
    
    try {
      await api.put(`/categories/${groupId}`, {
        items: [...currentItems, newItem.trim()]
      });
      fetchCategories();
      showToast('Variety added', 'success');
    } catch (err) {
      showToast('Failed to add variety', 'error');
    }
  };

  const handleRemoveItem = async (groupId: string, currentItems: string[], itemToRemove: string) => {
    try {
      await api.put(`/categories/${groupId}`, {
        items: currentItems.filter(i => i !== itemToRemove)
      });
      fetchCategories();
      showToast('Variety removed', 'success');
    } catch (err) {
      showToast('Failed to remove variety', 'error');
    }
  };

  const handleQuickSeed = async () => {
    if (!confirm('This will populate the database with default categories. Continue?')) return;
    try {
      setIsLoading(true);
      await api.post('/categories/seed?force=true', {});
      await fetchCategories();
      showToast('Database seeded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Seeding failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.gender && c.gender.toLowerCase() === activeGender.toLowerCase()
  );

  return (
    <div className="animate-fade-in relative min-h-[calc(100vh-140px)] pb-20 px-4 sm:px-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-fade-up ${toast.type === 'success' ? 'bg-stone-900 text-white' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          <span className="text-sm font-medium tracking-wide">{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif tracking-tight text-stone-900 mb-2">Category Ecosystem</h1>
          <p className="text-sm text-stone-500 font-normal">Manage store varieties and groupings in real-time.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleQuickSeed}
            className="px-5 py-2.5 border border-stone-200 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all"
          >
            Quick Seed
          </button>
          <button
            onClick={async () => {
              if (!confirm('This will import all unique categories from your products. Continue?')) return;
              try {
                setIsLoading(true);
                const data = await api.post('/categories/sync', {});
                await fetchCategories();
                showToast(`Sync complete! Added ${data.addedCount} new categories.`, 'success');
              } catch (err: any) {
                showToast(err.message || 'Sync failed', 'error');
              } finally {
                setIsLoading(false);
              }
            }}
            className="px-5 py-2.5 border border-stone-900 bg-stone-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-md"
          >
            Sync from Products
          </button>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {(['men', 'women', 'kids'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                className={`px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${activeGender === g ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Group */}
      <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <LayoutGrid className="w-6 h-6 text-stone-900" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-serif text-stone-900 mb-1">Add New Collection Group</h2>
          <p className="text-xs text-stone-400 font-normal uppercase tracking-widest">e.g. Occasion Wear, Winter Essentials</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group Name"
            className="flex-1 md:w-64 px-5 py-3.5 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-stone-900 transition-all font-normal"
          />
          <button
            onClick={handleCreateGroup}
            className="bg-stone-900 text-white px-6 py-3.5 rounded-xl hover:bg-stone-800 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-stone-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCategories.map((group) => (
            <div key={group._id} className="group bg-white border border-stone-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-stone-900 mb-1">{group.group}</h3>
                  <div className="h-[1px] w-8 bg-stone-900/20" />
                </div>
                <button 
                  onClick={() => handleDeleteGroup(group._id)}
                  className="p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex flex-wrap gap-2.5 mb-8">
                {group.items.map((item: string) => (
                  <div key={item} className="flex items-center gap-2 px-3.5 py-2 bg-stone-50 border border-stone-100 rounded-full group/item hover:bg-white hover:border-stone-200 transition-all">
                    <span className="text-[13px] font-medium text-stone-700">{item}</span>
                    <button 
                      onClick={() => handleRemoveItem(group._id, group.items, item)}
                      className="text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleAddItem(group._id, group.items)}
                className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-stone-300 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all mt-auto"
              >
                <Plus className="w-4 h-4" />
                Add Variety
              </button>
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200 flex flex-col items-center justify-center text-center">
              <LayoutGrid className="w-12 h-12 text-stone-200 mb-4" />
              <p className="font-serif text-xl text-stone-900 mb-2">No {activeGender} collections found</p>
              <p className="text-xs text-stone-400 uppercase tracking-widest max-w-xs mx-auto leading-loose">
                Your database appears empty for this category. Use "Quick Seed" above to populate defaults or add a new group manually.
              </p>
              <button 
                onClick={fetchCategories}
                className="mt-6 text-[10px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-all"
              >
                Refresh Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
