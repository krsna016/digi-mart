import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PromoGrid from "@/components/PromoGrid";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PromoGrid />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
