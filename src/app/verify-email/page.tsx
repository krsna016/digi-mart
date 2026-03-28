"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        const response = await api.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may be expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full bg-background rounded-[2.5rem] border border-stone-300 p-12 text-center shadow-sm">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="w-12 h-12 text-foreground animate-spin" strokeWidth={1.5} />
              <h1 className="text-2xl font-serif text-foreground">Verifying your email...</h1>
              <p className="text-sm text-stone-500 font-normal leading-relaxed">Please wait while we confirm your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-serif text-foreground">Email Verified</h1>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">{message}</p>
              </div>
              <Link 
                href="/login" 
                className="mt-4 w-full bg-primary text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group"
              >
                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-serif text-foreground">Verification Failed</h1>
                <p className="text-sm text-stone-500 font-normal leading-relaxed">{message}</p>
              </div>
              <Link 
                href="/signup" 
                className="mt-4 w-full border border-stone-300 text-foreground py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-background-alt transition-all"
              >
                Back to Sign Up
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
