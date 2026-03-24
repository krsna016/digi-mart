import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SustainabilityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500 mb-4">Commitment</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 tracking-tight">Designed for Longevity.</h1>
          <div className="prose prose-stone max-w-none">
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              Sustainability is not a feature; it's the foundation of everything we do. We believe the most sustainable product is the one that never needs to be replaced.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              From sourcing low-impact raw materials to partnering with ethical factories that prioritize worker well-being, we are committed to reducing our environmental footprint at every stage of the lifecycle.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed font-normal">
              Our goal is to create products that age gracefully, minimizing waste and promoting a circular economy through quality and timeless design.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
