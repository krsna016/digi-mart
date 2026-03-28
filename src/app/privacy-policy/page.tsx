import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-4">Legal</span>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-12 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-stone max-w-none space-y-12">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground mb-4">1. Data Usage</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                We collect information to provide better services to all our users. This includes information you provide to us (such as your name, email address, and shipping information) and information we collect as you use our services (such as product preferences and browsing history).
              </p>
              <p className="text-stone-700 leading-relaxed font-normal mt-4">
                This data is used to process your orders, personalize your shopping experience, and improve the overall quality of our platform. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground mb-4">2. User Rights</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                You have the right to access, update, or delete your personal information at any time. If you have an account with us, you can manage your data directly through your account settings. 
              </p>
              <p className="text-stone-700 leading-relaxed font-normal mt-4">
                Additionally, you have the right to object to the processing of your data, the right to data portability, and the right to withdraw consent where we rely on it to process your information.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground mb-4">3. Security</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction. This includes encryption, secure socket layers (SSL), and regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground mb-4">4. Cookies</h2>
              <p className="text-stone-700 leading-relaxed font-normal">
                We use cookies to enhance your browsing experience, remember your preferences, and analyze our traffic. You can choose to disable cookies through your browser settings, though this may affect the functionality of certain parts of our site.
              </p>
            </section>

            <div className="pt-12 border-t border-stone-200 italic text-stone-500 text-sm">
              Last updated: March 2026
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
