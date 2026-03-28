"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BASE_URL } from '@/utils/config';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch(`${BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Subscribed successfully' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to connect to server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32 pb-4 lg:pb-6 bg-background">
      <footer className="bg-[#151414] text-stone-100 py-16 md:py-24 rounded-[2.5rem]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 lg:pr-12">
            <Link href="/">
              <h3 className="text-6xl font-serif text-white mb-6 tracking-tight hover:text-stone-300 transition-colors">DIGIMART</h3>
            </Link>

            <div className="max-w-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-6">Newsletter</h4>
              <form onSubmit={handleSubmit} className="relative flex items-center border border-stone-800 rounded-full focus-within:border-white transition-colors py-2 px-4 group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS"
                  className="bg-transparent w-full text-[11px] font-medium tracking-widest outline-none placeholder-stone-600 !text-white uppercase caret-white"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-primary text-stone-500 transition-colors disabled:opacity-50 ml-2"
                >
                  {loading ? '...' : 'Join'}
                </button>
              </form>
              {status.message && (
                <p className={`mt-4 text-[11px] font-medium tracking-wide ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {status.message}
                </p>
              )}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h4 className="text-[14px] font-medium uppercase tracking-[0.2em] text-white/70 mb-8">Shop</h4>
            <ul className="space-y-5 text-[14px] tracking-wide text-stone-200 font-normal">
              <li><Link href="/category/men" className="hover:text-white transition-all duration-300">Men</Link></li>
              <li><Link href="/category/women" className="hover:text-white transition-all duration-300">Women</Link></li>
              <li><Link href="/category/kids" className="hover:text-white transition-all duration-300">Kids</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="lg:col-span-2">
            <h4 className="text-[14px] font-medium uppercase tracking-[0.2em] text-white/70 mb-8">About</h4>
            <ul className="space-y-4 text-[14px] text-stone-200 font-normal">
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">Our Story</Link></li>
              <li><Link href="/sustainability" className="hover:text-white transition-colors duration-300">Sustainability</Link></li>
              <li><Link href="/materials" className="hover:text-white transition-colors duration-300">Materials</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors duration-300">Journal</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-[14px] font-medium uppercase tracking-[0.2em] text-white/70 mb-8">Support</h4>
            <ul className="space-y-4 text-[14px] text-stone-200 font-normal">
              <li><Link href="/contact" className="hover:text-white transition-colors duration-300">Contact</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition-colors duration-300">FAQs</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-[14px] font-medium uppercase tracking-[0.2em] text-white/70 mb-8">Legal</h4>
            <ul className="space-y-4 text-[14px] text-stone-200 font-normal">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors duration-300">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 text-[14px] uppercase tracking-widest text-stone-400 font-medium">
          <p>&copy; {new Date().getFullYear()} DigiMart. All rights reserved.</p>
        </div>
      </div>
      </footer>
    </div>
  );
}
