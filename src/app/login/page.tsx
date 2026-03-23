"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded mock credentials
    if (email === 'admin@digimart.com' && password === 'admin123') {
      // Set an administrative cookie matching the exact key expected by middleware.ts
      document.cookie = "admin_token=true; path=/; max-age=86400; SameSite=Strict";
      router.push('/admin');
    } else {
      setError("Invalid credentials. Use admin@digimart.com / admin123");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in relative z-10 w-full overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-stone-100/50 blur-[100px] pointer-events-none -z-10" />

        <div className="w-full max-w-sm bg-white p-10 sm:p-12 rounded-2xl border border-stone-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] relative z-20">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-stone-900 tracking-tight mb-3">Admin Login</h1>
            <p className="text-[13px] text-stone-500 font-light loading-relaxed">
              Sign in to manage your premium inventory and storefront settings.
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="text-[12px] font-medium tracking-wide text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 animate-fade-in text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200/80 rounded-xl text-[13px] outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all font-light placeholder:text-stone-400 shadow-inner"
                placeholder="admin@digimart.com"
                required
              />
            </div>
            
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200/80 rounded-xl text-[13px] outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all font-light placeholder:text-stone-400 shadow-inner tracking-widest"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-stone-900 text-white px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-stone-800 transition-all mt-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-[11px] text-stone-400 text-center mt-8 font-light">
            Need help? <a href="#" className="hover:text-stone-900 underline transition-colors">Contact Support</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
