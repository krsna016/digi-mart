"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, ArrowLeft, MessageSquare } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[440px] animate-fade-up">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-stone-400" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-serif mb-3 tracking-tight">Reset Password</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-8">
              Under Maintenance
            </p>
          </div>

          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] border border-stone-200 text-center">
            <div className="space-y-6">
              <p className="text-sm text-stone-600 leading-relaxed">
                Our password recovery system is currently being updated to ensure the highest level of security for your account.
              </p>
              
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Need immediate help?</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-foreground font-bold text-[11px] uppercase tracking-widest hover:opacity-70 transition-opacity">
                  <MessageSquare className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>

              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Lock } from 'lucide-react';
