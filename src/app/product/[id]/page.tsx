import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddToCartButton from '@/components/AddToCartButton';
import { BASE_URL } from '@/utils/api';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }
  return null;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-24 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Gallery Column */}
          <div className="w-full aspect-[3/4] bg-stone-200 relative overflow-hidden animate-fade-in group">
            <img 
              src={product.image} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-900/50 mb-6">
              {product.category}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-stone-900 tracking-tight leading-tight mb-6">
              {product.name}
            </h1>
            <p className="text-xl text-stone-600 font-normal mb-10">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="h-px w-full bg-stone-200 mb-10" />
            
            <p className="text-sm text-stone-600 leading-relaxed font-normal mb-12 max-w-prose">
              {product.description}
            </p>

            <AddToCartButton product={{
              id: product._id || product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category
            }} />
            
            <div className="mt-16 space-y-4 text-[11px] font-medium uppercase tracking-widest text-stone-900/60">
              <div className="flex justify-between border-b border-stone-200 pb-4">
                <span>Free Standard Shipping</span>
                <span>On Orders Over $150</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-4">
                <span>Returns</span>
                <span>Within 30 Days</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
