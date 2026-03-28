import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

// New Home Sections
import CategorySection from "@/components/home/CategorySection";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import ProductCarousel from "@/components/home/ProductCarousel";
import FullWidthBanner from "@/components/home/FullWidthBanner";
import LookbookSection from "@/components/home/LookbookSection";
import SaleSection from "@/components/home/SaleSection";
import NewsletterSection from "@/components/home/NewsletterSection";

// PromoGrid is no longer used here but kept in components if needed elsewhere.

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 w-full overflow-hidden px-4 lg:px-6 flex flex-col gap-10 md:gap-12 pb-12">
        <Hero />
        <CategorySection />
        <FeaturedCollection />
        <ProductCarousel title="New Arrivals" subtitle="The Latest" />
        <FullWidthBanner />
        <ProductGrid title="Best Sellers" subtitle="Most Desired" />
        <LookbookSection />
        <SaleSection />
        <ProductGrid title="Trending Now" subtitle="Popular Pieces" />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
