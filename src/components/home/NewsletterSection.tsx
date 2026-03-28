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
    <section className="w-full bg-background-alt py-16 flex items-center justify-center rounded-[2.5rem] shadow-premium border border-stone-200/40">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-foreground mb-6">Join The Journal</span>
        <h2 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight leading-tight mb-6">
          Intelligence for a curated life.
        </h2>
        <p className="text-stone-500 font-light text-sm mb-12 max-w-md mx-auto">
          Subscribe to receive exclusive access to early product releases, private events, and our editorial journal.
        </p>

        {subscribed ? (
          <div className="p-8 border rounded-[2.5rem] font-serif text-xl border-primary/20 bg-background text-foreground animate-fade-up shadow-sm">
            Thank you for subscribing.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto flex items-center border border-stone-300 rounded-full focus-within:border-primary transition-colors p-2 pl-6 shadow-sm bg-background">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-stone-400 text-sm py-2"
            />
            <button 
              type="submit"
              className="absolute right-2 rounded-full border border-primary bg-primary text-[10px] font-bold uppercase tracking-widest text-primary-foreground hover:bg-foreground hover:border-foreground transition-colors px-6 py-2.5"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
