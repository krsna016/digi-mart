"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[420px] animate-fade-up">
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-8 text-2xl font-serif tracking-tighter text-stone-900">
              DIGIMART
            </Link>
            <h1 className="text-2xl font-serif text-stone-900 mb-2">Welcome Back</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">Enter your details to sign in</p>
          </div>

          {/* Form */}
          <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] border border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold uppercase tracking-widest text-center rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-900 transition-colors" strokeWidth={1.5} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:border-stone-900 rounded-xl px-11 py-3.5 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Password</label>
                    <Link href="/forgot-password" title="Forgot Password" className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-900 hover:opacity-60 transition-opacity">Forgot?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-900 transition-colors" strokeWidth={1.5} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-100 focus:bg-white focus:border-stone-900 rounded-xl px-11 py-3.5 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> }
                </span>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-stone-50 text-center">
              <p className="text-[11px] font-medium text-stone-400">
                Don't have an account? {' '}
                <Link href="/signup" className="text-stone-900 font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-stone-200">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
