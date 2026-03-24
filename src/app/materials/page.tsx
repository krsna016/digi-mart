import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MaterialsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500 mb-4">Integrity</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 tracking-tight">The Finest Raw Materials.</h1>
          <div className="prose prose-stone max-w-none">
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              We travel the world to find materials that meet our uncompromising standards for quality, texture, and durability. Whether it's the exceptionally soft hand of GOTS-certified organic cotton or the timeless resilience of full-grain leather.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              Every fiber and finish is tested for performance and longevity. We believe that by starting with the best materials, we can create products that not only look better but feel better over time.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed font-normal">
              Explore our material library and learn about the provenance and properties of our signature textiles and leathers.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
