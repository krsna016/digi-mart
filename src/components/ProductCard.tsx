import Link from 'next/link';
import { Product } from '@/data/products';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ id, name, price, image, category, ...rest }: Product & { mainCategory?: string }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

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
        image, 
        category,
        description: (rest as any).description || "",
        mainCategory: (rest as any).mainCategory
      });
    }
  };

  return (
    <Link href={`/product/${id}`} className="group flex flex-col cursor-pointer w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 mb-4 rounded-md">
        <img 
          src={image} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-stone-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-stone-900 text-stone-900' : 'text-stone-400'}`} 
            strokeWidth={1.2} 
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 ease-out rounded-md" />
        
        {/* Quick View button on hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <div className="bg-white/95 px-6 py-2.5 text-[10px] font-medium uppercase tracking-widest text-stone-900 shadow-sm backdrop-blur-sm whitespace-nowrap rounded-sm">
            Quick View
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="text-[16px] text-stone-900 tracking-wide font-medium leading-snug">{name}</h3>
        <p className="text-[16px] text-stone-700 font-normal">₹{price}</p>
      </div>
    </Link>
  );
}
