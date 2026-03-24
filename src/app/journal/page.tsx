import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function JournalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500 mb-4">The Journal</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 tracking-tight">Stories on Living Well.</h1>
          <div className="prose prose-stone max-w-none">
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              Welcome to the Journal—a space where we share inspiration, artisan interviews, and reflections on the art of slow living.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed mb-6 font-normal">
              Discover the stories behind our collections, tips for maintaining your luxury essentials, and curated guides for creating a more intentional home and wardrobe.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed font-normal">
              Check back frequently for new entries and insights into our creative process and community.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
