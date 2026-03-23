import ProductCard from './ProductCard';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Cashmere Crew Sweater', price: '$120', colorClass: 'bg-[#DCD8D3]' },
  { id: '2', name: 'Italian Leather Tote', price: '$250', colorClass: 'bg-[#D2CDC6]' },
  { id: '3', name: 'Silk Sleep Mask', price: '$45', colorClass: 'bg-[#EAE5DF]' },
  { id: '4', name: 'Linen Bedding Set', price: '$180', colorClass: 'bg-[#C2BCB6]' },
  { id: '5', name: 'Ceramic Table Lamp', price: '$150', colorClass: 'bg-[#D4D5CE]' },
  { id: '6', name: 'Minimalist Gold Watch', price: '$195', colorClass: 'bg-[#DAD6D6]' },
  { id: '7', name: 'Organic Cotton Tee', price: '$35', colorClass: 'bg-[#F2F2F2]' },
  { id: '8', name: 'Alpaca Throw Blanket', price: '$110', colorClass: 'bg-[#DFD9D6]' },
];

export default function ProductGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-12 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="max-w-xl">
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-stone-900/50 mb-4">Latest Additions</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight leading-tight">Quiet Luxury line</h2>
        </div>
        <button className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-900 border-b border-stone-900/30 pb-1 hover:border-stone-900 transition-colors self-start md:self-auto group relative">
          View Collection
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {MOCK_PRODUCTS.map((product, idx) => (
          <div key={product.id} className="opacity-0 animate-fade-up" style={{ animationDelay: `${0.1 * (idx % 4)}s` }}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
}
