import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
