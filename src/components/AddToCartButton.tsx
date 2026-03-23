"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
    
    setToastMessage(`${product.name} added to bag!`);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <>
      <button 
        onClick={handleAdd}
        className="w-full sm:w-max px-12 py-5 bg-stone-900 text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors duration-300 group shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 relative active:translate-y-0"
      >
        <span className="flex items-center justify-center gap-3">
          Add to Bag
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-lg bg-stone-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center gap-3 animate-fade-up border border-stone-800">
          <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}
    </>
  );
}
