"use client";

import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
        <Navbar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-16 animate-fade-in">
        <h1 className="text-4xl font-serif text-stone-900 mb-2">Shopping Bag</h1>
        <p className="text-sm text-stone-500 font-normal mb-12">
          {cart.length === 0 ? "Your bag is currently empty." : `You have ${cart.length} unique item${cart.length !== 1 ? 's' : ''} in your bag.`}
        </p>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-stone-200/60 rounded-2xl shadow-sm text-center px-4">
            <svg className="w-16 h-16 text-stone-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-serif text-stone-900 mb-3">Your bag is empty</h2>
            <p className="text-stone-500 font-normal mb-10 max-w-md">Looks like you haven't added anything to your bag yet. Explore our premium collections to get started.</p>
            <Link 
              href="/" 
              className="px-8 py-4.5 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-6 p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm group transition-all hover:shadow-md">
                  <Link href={`/product/${item.id}`} className="block w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                        <div className="w-full h-full bg-stone-100" />
                    )}
                  </Link>
                  
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/product/${item.id}`}>
                          <h3 className="text-lg font-medium text-stone-900 hover:text-stone-600 transition-colors">{item.name}</h3>
                        </Link>
                        {item.category && <p className="text-xs text-stone-500 font-normal mt-1">{item.category}</p>}
                        <p className="text-sm font-medium text-stone-900 mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-300 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center border border-stone-200/80 rounded-lg bg-stone-50 shadow-inner">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-stone-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-1 font-semibold">Total</p>
                        <p className="text-base font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-1/3 sticky top-28 bg-white border border-stone-200/80 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-serif text-stone-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-normal text-stone-600 border-b border-stone-100 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-stone-400">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-base font-medium text-stone-900">Estimated Total</span>
                <span className="text-2xl font-serif text-stone-900">${cartTotal.toFixed(2)}</span>
              </div>
              
              <button 
                className="w-full bg-stone-900 text-white px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-stone-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-2 text-stone-400 text-xs">
                <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure encrypting checkout
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
