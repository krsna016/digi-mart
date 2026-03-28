"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) setSubscribed(true);
  };

  return (
    <section className="w-full bg-stone-50 py-16 flex items-center justify-center rounded-lg">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-stone-900 mb-6">Join The Journal</span>
        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight leading-tight mb-6">
          Intelligence for a curated life.
        </h2>
        <p className="text-stone-500 font-light text-sm mb-12 max-w-md mx-auto">
          Subscribe to receive exclusive access to early product releases, private events, and our editorial journal.
        </p>

        {subscribed ? (
          <div className="p-8 border rounded-lg font-serif text-xl border-stone-200 bg-white text-stone-900 animate-fade-up">
            Thank you for subscribing.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto flex items-center border border-stone-300 rounded-full focus-within:border-stone-900 transition-colors p-2 pl-6">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400 text-sm py-2"
            />
            <button 
              type="submit"
              className="absolute right-2 rounded-full border border-stone-900 text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-white transition-colors px-6 py-2.5"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
