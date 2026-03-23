export default function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden bg-[#F2F0E9] flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-900/60 mb-8">
            The Essentials Collection
          </span>
        </div>
        <h1 
          className="max-w-5xl text-6xl font-serif font-light sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[1.1] tracking-[-0.02em] text-stone-900 mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          Elevate Your Everyday.
        </h1>
        <p 
          className="max-w-lg text-lg text-stone-900/60 mb-12 font-light leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          Discover curated essentials crafted with uncompromising quality, designed to endure beautifully through the seasons.
        </p>
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.7s' }}>
          <button className="group relative overflow-hidden bg-stone-900 text-white px-10 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-transform duration-300 hover:scale-105">
            <span className="relative z-10">Explore Now</span>
            <div className="absolute inset-0 bg-stone-800 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
