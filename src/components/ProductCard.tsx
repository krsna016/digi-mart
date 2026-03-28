import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductImage from './ProductImage';

export default function ProductCard({ id, name, price, image, category, onSale, discountPrice, ...rest }: Product & { mainCategory?: string }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ 
        id, 
        name, 
        price, 
        image: hasError ? '/images/fallback.png' : image, 
        category,
        onSale,
        discountPrice,
        description: (rest as any).description || "",
        mainCategory: (rest as any).mainCategory
      });
    }
  };

  return (
    <Link href={`/product/${id}`} className="group flex flex-col cursor-pointer w-full">
      <div className="relative aspect-[3/4] w-full mb-4">
        <ProductImage 
          src={image} 
          alt={name}
          className="rounded-2xl"
        />
        
        {/* Sale Badge */}
        {onSale && (
          <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-card animate-fade-in">
            Sale
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-card opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-primary text-primary' : 'text-stone-500'}`} 
            strokeWidth={1.2} 
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 ease-out rounded-2xl" />
        
        {/* Quick View button on hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <div className="bg-background/95 px-6 py-2.5 text-[10px] font-medium uppercase tracking-widest text-foreground shadow-card backdrop-blur-sm whitespace-nowrap rounded-full">
            Quick View
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="text-[14px] text-foreground tracking-wide font-medium leading-snug truncate">{name}</h3>
        <div className="flex items-center gap-2">
          {onSale && discountPrice ? (
            <>
              <p className="text-[14px] text-primary font-bold">₹{discountPrice}</p>
              <p className="text-[12px] text-stone-500 font-normal line-through italic">₹{price}</p>
            </>
          ) : (
            <p className="text-[14px] text-foreground font-semibold">₹{price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
