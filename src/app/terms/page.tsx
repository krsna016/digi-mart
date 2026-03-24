import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-12 tracking-tight">Terms &amp; Conditions</h1>
          
          <div className="prose prose-stone max-w-none space-y-12">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-stone-900 mb-4">1. Terms of Service</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                By accessing and using DigiMart, you agree to follow and be bound by the following terms and conditions. These terms govern your use of the website and any services provided through it.
              </p>
              <p className="text-stone-700 leading-relaxed font-normal mt-4">
                We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the site after any such changes constitutes your agreement to follow and be bound by the terms as changed.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-stone-900 mb-4">2. Intellectual Property</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                All content on this site, including text, graphics, logos, and images, is the property of DigiMart and is protected by international copyright laws. You may not reproduce, distribute, or display any part of this site without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-stone-900 mb-4">3. Limitation of Liability</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                DigiMart is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of this site or the information, content, or materials included on it.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-stone-900 mb-4">4. Governing Law</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law principles.
              </p>
            </section>

            <div className="pt-12 border-t border-stone-100 italic text-stone-500 text-sm">
              Last updated: March 2026
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
