import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500 mb-4">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 tracking-tight">Radical Quality. Emotional Design.</h1>
          <div className="prose prose-stone max-w-none">
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              At DigiMart, we believe that the objects we surround ourselves with should be meaningful. We started with a simple idea: that luxury shouldn't be defined by a price tag or a logo, but by the integrity of the materials and the care taken in the craft.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              Our collection is a curated selection of essentials designed to endure. We partner with the world's finest artisans to create pieces that are as beautiful as they are functional, bridging the gap between timeless tradition and modern life.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed font-normal">
              Thank you for being part of our journey toward a more intentional and well-lived life.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
