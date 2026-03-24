"use client";

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BASE_URL } from '@/utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully. We will get back to you soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to connect to server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500 mb-4 text-center">Inquiries</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-12 tracking-tight text-center">Contact Us</h1>
          
          <div className="bg-stone-50 p-8 md:p-12 rounded-lg border border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-3">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:border-stone-900 outline-none transition-colors font-normal"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-3">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:border-stone-900 outline-none transition-colors font-normal"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-3">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:border-stone-900 outline-none transition-colors font-normal resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {status.message && (
                <p className={`text-center text-[11px] font-medium tracking-wide ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">Email</h4>
              <p className="text-sm text-stone-900 font-medium">concierge@digimart.com</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">Office</h4>
              <p className="text-sm text-stone-900 font-medium leading-relaxed">
                123 Minimalist Way<br />
                Design District, NY 10013
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
