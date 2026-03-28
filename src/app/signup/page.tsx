"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Gmail only validation
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only Gmail accounts are allowed for registration');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      setIsEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-[420px] bg-background p-10 lg:p-12 rounded-[2.5rem] shadow-sm border border-stone-300 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-background-alt rounded-full flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-foreground" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-serif text-foreground mb-4">Verify your email</h1>
            <p className="text-sm text-stone-500 font-normal leading-relaxed mb-10">
              We've sent a verification link to <span className="text-foreground font-bold">{email}</span>. 
              Please verify your account to continue.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.open('https://mail.google.com', '_blank')}
                className="w-full bg-primary text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group"
              >
                Open Gmail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                href="/login" 
                className="block text-[10px] text-stone-500 font-bold uppercase tracking-widest hover:text-foreground transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[420px] animate-fade-up">
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-8 text-2xl font-serif tracking-tighter text-foreground">
              DIGIMART
            </Link>
            <h1 className="text-2xl font-serif text-foreground mb-2">Create Account</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">Join our community today</p>
          </div>

          {/* Form */}
          <div className="bg-background p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] border border-stone-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold uppercase tracking-widest text-center rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-foreground transition-colors" strokeWidth={1.5} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-background-alt border border-stone-200 focus:bg-background focus:border-stone-900 rounded-xl px-11 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-stone-400"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Gmail Address Only</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-foreground transition-colors" strokeWidth={1.5} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full bg-background-alt border border-stone-200 focus:bg-background focus:border-stone-900 rounded-xl px-11 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-stone-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-foreground transition-colors" strokeWidth={1.5} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background-alt border border-stone-200 focus:bg-background focus:border-stone-900 rounded-xl px-11 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-stone-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-stone-500 ml-1 mt-1">Must be at least 6 characters</p>
                </div>
              </div>

              <div className="flex items-start gap-3 px-1">
                <input type="checkbox" id="terms" className="mt-1" required />
                <label htmlFor="terms" className="text-[10px] text-stone-500 leading-relaxed font-normal">
                  I agree to the <Link href="/terms" className="text-foreground font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-foreground font-bold hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> }
                </span>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-stone-50 text-center">
              <p className="text-[11px] font-medium text-stone-500">
                Already have an account? {' '}
                <Link href="/login" className="text-foreground font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-stone-200">
                  Sign In
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
