"use client";

import { useAuth, Address } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, LogOut, ChevronRight, ShoppingBag, MapPin, Plus, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AddressesContent() {
  const { user, logout, isAuthenticated, isLoading, getAddresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const message = searchParams.get('message');
  
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    addressLine: '',
    city: '',
    state: '',
    country: 'India',
    isDefault: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchAddresses();
    }
  }, [mounted, isAuthenticated]);

  const handleOpenModal = (address: Address | null = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        pincode: address.pincode,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        country: address.country,
        isDefault: address.isDefault
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: '',
        phone: '',
        pincode: '',
        addressLine: '',
        city: '',
        state: '',
        country: 'India',
        isDefault: addresses.length === 0
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      let updatedAddresses;
      if (editingAddress) {
        updatedAddresses = await updateAddress(editingAddress._id, formData);
      } else {
        updatedAddresses = await addAddress(formData);
      }
      setAddresses(updatedAddresses);
      setIsModalOpen(false);
      
      // If redirect exists, go back
      if (redirect) {
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const updatedAddresses = await deleteAddress(id);
        setAddresses(updatedAddresses);
      } catch (err) {
        console.error('Failed to delete address', err);
      }
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      const updatedAddresses = await updateAddress(address._id, { ...address, isDefault: true });
      setAddresses(updatedAddresses);
    } catch (err) {
      console.error('Failed to set default address', err);
    }
  };

  if (!mounted || isLoading || (loading && addresses.length === 0)) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCFBF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          <p className="text-[12px] uppercase tracking-[0.3em] text-stone-600 font-medium">Loading Addresses</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarLinks = [
    { name: 'Account Overview', href: '/account', icon: User },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Shopping Bag', href: '/cart', icon: ShoppingBag },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin, active: true },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-8 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-serif text-stone-900 tracking-tight mb-1">My Account</h1>
              <p className="text-[13px] uppercase tracking-[0.2em] text-stone-600 font-medium">Welcome back, {user?.name?.split(' ')[0]}</p>
            </div>

            <nav className="flex flex-col border-t border-stone-100 pt-8">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between py-4 group transition-all duration-300 ${link.active ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <div className="flex items-center gap-4">
                    <link.icon className={`w-4 h-4 stroke-[1.5px] ${link.active ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-900'} transition-colors`} />
                    <span className="text-[13px] font-bold uppercase tracking-[0.2em]">{link.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${link.active ? 'opacity-100 translate-x-0' : ''}`} strokeWidth={1.5} />
                </Link>
              ))}
              
              <button
                onClick={logout}
                className="flex items-center gap-4 py-4 mt-4 text-red-400 hover:text-red-600 transition-colors group border-t border-stone-50 pt-8"
              >
                <LogOut className="w-4 h-4 stroke-[1.5px] text-red-300 group-hover:text-red-600 transition-colors thin" />
                <span className="text-[13px] font-bold uppercase tracking-[0.2em]">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col gap-12">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-serif text-stone-900 tracking-tight">Saved Addresses</h2>
                <p className="text-[13px] uppercase tracking-[0.2em] text-stone-600 font-medium">Manage your shipping and billing locations</p>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white text-[12px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-stone-800 transition-all active:scale-95 shadow-lg group"
              >
                <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                Add New Address
              </button>
            </div>

            {message && (
              <div className="p-6 bg-stone-900 text-white rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-stone-900/10">
                <AlertCircle className="w-5 h-5 text-stone-400 shrink-0" />
                <p className="text-[12px] font-bold uppercase tracking-[0.2em]">{message}</p>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-stone-200/50 rounded-[2.5rem] shadow-[0_4px_30px_-10px_rgba(0,0,0,0.02)] gap-6">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-stone-500" strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="text-xl font-serif text-stone-900">No addresses saved yet</h3>
                  <p className="text-sm text-stone-600 font-normal max-w-xs mx-auto">Add a shipping address to speed up your next checkout.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="mt-4 px-8 py-3.5 border border-stone-200 text-stone-900 text-[12px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-stone-50 transition-all active:scale-95"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {addresses.map((address) => (
                  <div key={address._id} className={`bg-white border ${address.isDefault ? 'border-stone-900 shadow-xl' : 'border-stone-200/50 shadow-sm'} p-8 rounded-3xl transition-all duration-500 flex flex-col justify-between group`}>
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <p className="text-[12px] font-serif text-stone-900 text-lg uppercase tracking-tight">{address.fullName}</p>
                          {address.isDefault && (
                            <span className="w-fit px-3 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">Default</span>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => handleOpenModal(address)}
                            className="p-2.5 rounded-full hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(address._id)}
                            className="p-2.5 rounded-full hover:bg-red-50 text-stone-600 hover:text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <MapPin className="w-4 h-4 text-stone-500 mt-1 shrink-0" strokeWidth={1.5} />
                          <p className="text-[14px] text-stone-500 font-normal leading-relaxed tracking-wide">
                            {address.addressLine}<br />
                            {address.city}, {address.state} {address.pincode}<br />
                            {address.country}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">
                             <div className="w-3.5 h-3.5 rounded-full border border-stone-200" />
                          </div>
                          <p className="text-[14px] text-stone-500 font-normal tracking-wide">{address.phone}</p>
                        </div>
                      </div>
                    </div>

                    {!address.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(address)}
                        className="mt-8 text-[11px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-2"
                      >
                         <CheckCircle2 className="w-3 h-3" />
                         Set as Primary Address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="p-10 lg:p-14">
              <div className="mb-10">
                <h3 className="text-2xl font-serif text-stone-900 mb-2">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <p className="text-[13px] uppercase tracking-[0.2em] text-stone-600 font-medium">Please provide your complete shipping details</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-500 text-[12px] font-bold uppercase tracking-widest rounded-2xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2 text-stone-900">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white font-serif"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Phone</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Address Line</label>
                    <input 
                      type="text" 
                      required
                      value={formData.addressLine}
                      onChange={(e) => setFormData({...formData, addressLine: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">City</label>
                    <input 
                      type="text" 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">State</label>
                    <input 
                      type="text" 
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Pincode</label>
                    <input 
                      type="text" 
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white font-serif"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Country</label>
                    <input 
                      type="text" 
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="text-base font-medium border-b border-stone-100 pb-3 focus:outline-none focus:border-stone-900 transition-colors bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <input 
                     type="checkbox" 
                     id="isDefault"
                     checked={formData.isDefault}
                     onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                     className="w-4 h-4 rounded-md border-stone-300 text-stone-900 focus:ring-stone-900"
                   />
                   <label htmlFor="isDefault" className="text-[13px] font-bold uppercase tracking-[0.1em] text-stone-700 cursor-pointer">Set as default address</label>
                </div>

                <div className="flex items-center gap-6 pt-6 flex-col sm:flex-row">
                  <button 
                    type="submit" 
                    disabled={formLoading}
                    className="w-full px-10 py-5 bg-stone-900 text-white text-[13px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-stone-800 transition-all active:scale-95 shadow-xl shadow-stone-900/20 disabled:opacity-50"
                  >
                    {formLoading ? 'Processing...' : (editingAddress ? 'Save Changes' : 'Add Address')}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="w-fit text-[13px] font-bold uppercase tracking-[0.2em] text-stone-600 hover:text-stone-900 transition-colors px-4 py-2"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function AddressesPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-[#FCFBF8]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            <p className="text-[12px] uppercase tracking-[0.3em] text-stone-600 font-medium">Loading...</p>
          </div>
        </div>
    }>
      <AddressesContent />
    </Suspense>
  );
}
