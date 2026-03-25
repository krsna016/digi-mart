import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';
import { BASE_URL } from '@/utils/config';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 404) return { error: 'not_found' };
    return { error: 'api_error', status: res.status };
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    return { error: 'fetch_failed', message: error.message };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getProduct(id);

  if (!result || result.error) {
    if (result?.error === 'not_found') {
      notFound();
    }
    
    // For other errors (like connection refused on Vercel), show a helpful message
    return (
      <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
          <div className="bg-white border border-stone-100 rounded-3xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] w-full">
            <h1 className="text-3xl font-serif text-stone-900 mb-6">Connection Issue</h1>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
              Vercel was unable to reach your backend server from its cloud environment.
            </p>
            
            <div className="space-y-4 mb-10 text-left">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Attempted URL:</span>
                <code className="block bg-stone-50 px-4 py-3 rounded-xl border border-stone-100 text-stone-600 font-mono text-[12px] break-all">
                  {BASE_URL}/products/{id}
                </code>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Error Detail:</span>
                <code className="block bg-red-50/30 px-4 py-3 rounded-xl border border-red-100/30 text-red-500 font-mono text-[12px] break-all">
                  {result?.message || result?.error || 'Unknown Fetch Failure'}
                </code>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="px-10 py-4 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all shadow-lg active:scale-95">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const product = result;

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      <Navbar />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-24 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Gallery Column */}
          <div className="w-full aspect-[3/4] bg-stone-200 relative rounded-2xl overflow-hidden animate-fade-in group">
            <img 
              src={product.image} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-stone-900/50 mb-6">
              {product.category}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-stone-900 tracking-tight leading-tight mb-6">
              {product.name}
            </h1>
            <p className="text-xl text-stone-600 font-normal mb-10">
              ₹{product.price.toFixed(2)}
            </p>
            
            <div className="h-px w-full bg-stone-200 mb-10" />
            
            <p className="text-[16px] text-stone-600 leading-relaxed font-normal mb-12 max-w-prose">
              {product.description}
            </p>

            <AddToCartButton product={{
              id: product._id || product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category
            }} />
            
            <div className="mt-16 space-y-4 text-[13px] font-medium uppercase tracking-widest text-stone-900/60">
              <div className="flex justify-between border-b border-stone-200 pb-4">
                <span>Free Standard Shipping</span>
                <span>On Orders Over ₹150</span>
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
