"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const FAQ_DATA = [
  {
    section: "Orders & Shipping",
    questions: [
      {
        q: "How can I track my order?",
        a: "Once your order ships, you will receive an email with a tracking number and a link to track your package."
      },
      {
        q: "How long does shipping take?",
        a: "Standard shipping typically takes 3-5 business days within the continental US. International shipping times vary by destination."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times will be calculated at checkout."
      }
    ]
  },
  {
    section: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns of unworn, unwashed items in their original packaging within 30 days of delivery."
      },
      {
        q: "How do I start a return?",
        a: "Please visit our returns portal or contact our concierge team at support@digimart.com to begin the process."
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are typically processed within 5-10 business days after we receive and inspect your return."
      }
    ]
  },
  {
    section: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), as well as PayPal, Apple Pay, and Google Pay."
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all transactions are encrypted and processed through secure payment gateways. We never store your full credit card details."
      }
    ]
  },
  {
    section: "Account",
    questions: [
      {
        q: "How do I create an account?",
        a: "You can create an account by clicking the 'Account' icon in the navigation bar and selecting 'Sign Up'."
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click on 'Forgot Password' on the login page, and we will email you instructions to reset it."
      }
    ]
  }
];

function AccordionItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
      <button
        onClick={onClick}
        className="w-full py-7 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-serif tracking-tight transition-colors duration-300 ${isOpen ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}`}>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="text-stone-400"
        >
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-stone-500 leading-relaxed font-normal text-[15px] max-w-2xl pr-8">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="block text-[10px] font-medium uppercase tracking-[0.4em] text-stone-500 mb-6 text-center">Support</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-20 tracking-tight text-center">Frequently Asked Questions</h1>
          
          <div className="space-y-24">
            {FAQ_DATA.map((group, sectionIdx) => (
              <section key={sectionIdx} className="opacity-0 animate-fade-up" style={{ animationDelay: `${sectionIdx * 0.1}s`, animationFillMode: 'forwards' }}>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{group.section}</h2>
                <div className="border-t border-stone-200">
                  {group.questions.map((faq, idx) => {
                    const id = `${sectionIdx}-${idx}`;
                    return (
                      <AccordionItem
                        key={idx}
                        question={faq.q}
                        answer={faq.a}
                        isOpen={openIndex === id}
                        onClick={() => toggleAccordion(id)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-32 pt-16 border-t border-stone-100 text-center">
            <p className="text-stone-500 text-sm mb-8 font-normal">Still have questions?</p>
            <Link 
              href="/contact" 
              className="inline-block bg-stone-900 text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
