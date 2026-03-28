"use client";

import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div className={`relative overflow-hidden bg-stone-100 w-full h-full ${className}`}>
        <img 
          src="/images/fallback.png" 
          alt={alt}
          className="w-full h-full object-cover grayscale opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-[10px] uppercase tracking-widest font-medium text-stone-900/40 bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-full">No Image available</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-stone-100 w-full h-full ${className}`}>
      {/* Shimmer Effect */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 bg-[length:200%_100%] animate-shimmer z-10" />
      )}
      
      <img 
        src={hasError ? '/images/fallback.png' : src} 
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      />
    </div>
  );
}
