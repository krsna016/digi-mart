import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  colorClass: string;
}

export default function ProductCard({ id, name, price, colorClass }: ProductCardProps) {
  return (
    <Link href="#" className="group flex flex-col cursor-pointer w-full">
      <div className={`relative aspect-[3/4] w-full overflow-hidden ${colorClass} mb-5 bg-stone-200`}>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 ease-out" />
        
        {/* Subtle 'Quick View' button on hover for desktop */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <div className="bg-white/95 px-6 py-2.5 text-[10px] font-medium uppercase tracking-widest text-stone-900 shadow-sm backdrop-blur-sm">
            Quick View
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-[13px] text-stone-900 tracking-wide font-medium">{name}</h3>
        <p className="text-[13px] text-stone-500 font-light">{price}</p>
      </div>
    </Link>
  );
}
