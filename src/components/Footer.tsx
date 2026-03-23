import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4 lg:pr-12">
            <h3 className="text-2xl font-serif text-white mb-6 tracking-tight">DIGIMART</h3>
            <p className="text-sm text-stone-400 leading-relaxed font-light max-w-sm mb-8">
              Premium essentials for a well-lived life. Minimal design, maximal quality. Crafted to endure beautifully through the seasons.
            </p>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-8">Shop</h4>
            <ul className="space-y-4 text-[13px] text-stone-400 font-light">
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Women</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Men</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Accessories</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-8">About</h4>
            <ul className="space-y-4 text-[13px] text-stone-400 font-light">
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Materials</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors duration-300">Journal</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-4">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-8">Newsletter</h4>
            <p className="text-[13px] text-stone-400 mb-6 font-light">Sign up for exclusive offers, original stories, and events.</p>
            <form className="relative flex border-b border-stone-800 focus-within:border-white transition-colors pb-3 group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent w-full text-[11px] font-medium tracking-widest outline-none placeholder-stone-600 text-white"
              />
              <button type="button" className="text-[11px] font-medium uppercase tracking-[0.2em] hover:text-white text-stone-500 transition-colors absolute right-0 bottom-3">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] uppercase tracking-widest text-stone-600 font-medium">
          <p>&copy; {new Date().getFullYear()} DigiMart. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-stone-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-stone-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
