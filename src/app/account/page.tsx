"use client";

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, LogOut, ChevronRight, ShoppingBag, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const { user, logout, isAuthenticated, isLoading, getUserProfile, updateProfile } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage({ type: '', text: '' });
    
    try {
      await updateProfile({ name, email, password: password || undefined });
      setUpdateMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
      setPassword('');
      // Message disappears after 3 seconds
      setTimeout(() => setUpdateMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setUpdateMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      getUserProfile();
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCFBF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          <p className="text-[12px] uppercase tracking-[0.3em] text-stone-600 font-medium">Loading Account</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarLinks = [
    { name: 'Account Overview', href: '/account', icon: User, active: true },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Shopping Bag', href: '/cart', icon: ShoppingBag },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
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
                <LogOut className="w-4 h-4 stroke-[1.5px] text-red-300 group-hover:text-red-600 transition-colors" />
                <span className="text-[13px] font-bold uppercase tracking-[0.2em]">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col gap-12">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200/50 p-8 rounded-2xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.03)] flex flex-col gap-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Total Orders</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-serif text-stone-900">0</span>
                  <Link href="/orders" className="text-[11px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900/20 pb-0.5 hover:border-stone-900 transition-all">View All</Link>
                </div>
              </div>
              <div className="bg-white border border-stone-200/50 p-8 rounded-2xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.03)] flex flex-col gap-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Wishlist Items</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-serif text-stone-900">{wishlistCount}</span>
                  <Link href="/wishlist" className="text-[11px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900/20 pb-0.5 hover:border-stone-900 transition-all">Explore</Link>
                </div>
              </div>
              <div className="bg-white border border-stone-200/50 p-8 rounded-2xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.03)] flex flex-col gap-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Shopping Bag</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-serif text-stone-900">{cartCount}</span>
                  <Link href="/cart" className="text-[11px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900/20 pb-0.5 hover:border-stone-900 transition-all">Checkout</Link>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <section className="bg-white border border-stone-200/50 p-10 lg:p-12 rounded-3xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.03)] flex flex-col gap-12">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-serif text-stone-900">Profile Information</h2>
                  <p className="text-sm text-stone-600 font-normal tracking-wide">Manage your personal details.</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-stone-900 text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-stone-800 transition-all hover:shadow-lg active:scale-95"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {updateMessage.text && (
                <div className={`p-4 rounded-xl text-[12px] uppercase tracking-widest font-bold ${updateMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {updateMessage.text}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Full Name</label>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-base font-medium text-stone-900 border-b border-stone-100 pb-4 focus:outline-none focus:border-stone-900 transition-colors bg-transparent"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Email Address</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-base font-medium text-stone-900 border-b border-stone-100 pb-4 focus:outline-none focus:border-stone-900 transition-colors bg-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">New Password (optional)</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-base font-medium text-stone-900 border-b border-stone-100 pb-4 focus:outline-none focus:border-stone-900 transition-colors bg-transparent"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      type="submit"
                      disabled={updateLoading}
                      className="px-8 py-3 bg-stone-900 text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-pallowed shadow-lg"
                    >
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setEmail(user?.email || '');
                        setPassword('');
                      }}
                      className="px-8 py-3 border border-stone-200 text-stone-900 text-[12px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-stone-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Full Name</label>
                    <p className="text-base font-medium text-stone-900 border-b border-stone-100 pb-4">{user?.name}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-stone-600">Email Address</label>
                    <p className="text-base font-medium text-stone-900 border-b border-stone-100 pb-4">{user?.email}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-6">
                 <div className="bg-stone-50/50 rounded-2xl p-6 border border-stone-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                      <p className="text-[13px] font-bold text-stone-900 uppercase tracking-widest">Two-Factor Authentication</p>
                      <p className="text-[13px] text-stone-600 font-medium">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="text-[12px] font-bold uppercase tracking-[0.2em] text-stone-900 border border-stone-200 px-6 py-2.5 rounded-full hover:bg-white transition-all">
                      Enable 2FA
                    </button>
                 </div>
              </div>
            </section>

            {/* Account Overview Section */}
            <section className="bg-[#1C1C1C] text-white p-10 lg:p-14 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-stone-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex flex-col gap-6 lg:max-w-md">
                   <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-stone-600">Membership</p>
                   <h2 className="text-3xl lg:text-4xl font-serif tracking-tight leading-tight">Join the DIGIMART <br /> Insider Program</h2>
                   <p className="text-base text-stone-600 font-normal leading-relaxed tracking-wide">Get early access to collections, complimentary shipping on all orders, and personalized styling services.</p>
                   <button className="w-fit px-8 py-4 bg-white text-stone-900 text-[13px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-stone-100 transition-all active:scale-95 shadow-lg">
                      Learn More
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                   <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
                       <p className="text-[18px] font-serif">5%</p>
                       <p className="text-[11px] uppercase tracking-widest text-stone-500 font-bold">Rewards back</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
                       <p className="text-[18px] font-serif">Free</p>
                       <p className="text-[11px] uppercase tracking-widest text-stone-500 font-bold">Priority Shipping</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
                       <p className="text-[18px] font-serif">30</p>
                       <p className="text-[11px] uppercase tracking-widest text-stone-500 font-bold">Day returns</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
                       <p className="text-[18px] font-serif">24/7</p>
                       <p className="text-[11px] uppercase tracking-widest text-stone-500 font-bold">Expert support</p>
                   </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
