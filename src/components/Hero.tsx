"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const HERO_CONTENT = [
  {
    label: "Luxury Essentials",
    description: "Discover curated essentials crafted with uncompromising quality.",
    cta: "Explore Collection",
    path: "/collection"
  },
  {
    label: "Spring Drop",
    description: "Experience the perfect blend of timeless design and modern functionality in our new arrivals.",
    cta: "Shop New",
    path: "/new"
  },
  {
    label: "Seasonal Event",
    description: "Elevate your rituals with our ethically sourced materials, now at specialized value.",
    cta: "Shop Sale",
    path: "/sale"
  },
  {
    label: "Sustainable Style",
    description: "Meticulously engineered for longevity, helping you build a more intentional wardrobe.",
    cta: "About Us",
    path: "/about"
  }
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 4000); // 4 seconds for a more relaxed reading experience
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.2, 0, 0, 1],
      },
    },
  };


  return (
    <section className="relative w-full min-h-[85vh] overflow-hidden bg-[#F2F0E9] flex items-center justify-center border-b border-stone-200">
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants} className="h-6 mb-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="block text-[14px] font-medium uppercase tracking-[0.3em] text-stone-700"
            >
              {HERO_CONTENT[textIndex].label}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1
          className="max-w-5xl text-6xl font-serif font-normal sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[1.1] tracking-[-0.02em] text-stone-900 mb-8"
          variants={itemVariants}
        >
          Elevate Your Everyday.
        </motion.h1>

        <motion.div variants={itemVariants} className="min-h-[3rem] mb-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
              className="max-w-xl text-[13px] font-medium uppercase tracking-[0.2em] text-stone-700 leading-relaxed"
            >
              {HERO_CONTENT[textIndex].description}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link 
            href={HERO_CONTENT[textIndex].path}
            className="group relative inline-block overflow-hidden bg-stone-900 text-white px-10 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-transform duration-300 hover:scale-105"
          >
            <span className="relative z-10">{HERO_CONTENT[textIndex].cta}</span>
            <div className="absolute inset-0 bg-stone-800 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
