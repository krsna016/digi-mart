"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const HERO_CONTENT = [
  {
    label: "Luxury Essentials",
    description: "Discover curated essentials crafted with uncompromising quality.",
    cta: "Explore Now",
    path: "/collection"
  },
  {
    label: "Spring Drop",
    description: "Experience the perfect blend of timeless design and modern functionality in our new arrivals.",
    cta: "Explore Now",
    path: "/collection"
  },
  {
    label: "Seasonal Event",
    description: "Elevate your rituals with our ethically sourced materials, now at specialized value.",
    cta: "Explore Now",
    path: "/collection"
  },
  {
    label: "Sustainable Style",
    description: "Meticulously engineered for longevity, helping you build a more intentional wardrobe.",
    cta: "Explore Now",
    path: "/collection"
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
    <section className="relative w-full h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden rounded-[2.5rem] shadow-premium border border-stone-200/40">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/home_hero_bg.png" 
          alt="Luxury Fashion" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-stone-900/40" />
      </div>

      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10 flex flex-col items-center mt-16"
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
              className="block text-[14px] font-bold uppercase tracking-[0.4em] text-stone-200"
            >
              {HERO_CONTENT[textIndex].label}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1
          className="max-w-5xl text-6xl font-serif font-normal sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[1.05] tracking-tight text-white mb-8 drop-shadow-sm"
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
              className="max-w-xl text-[13px] font-medium uppercase tracking-[0.2em] text-stone-400 leading-relaxed"
            >
              {HERO_CONTENT[textIndex].description}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link 
            href={HERO_CONTENT[textIndex].path}
            className="group relative inline-block overflow-hidden rounded-full bg-primary text-primary-foreground px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] transition-transform duration-300 hover:scale-105 shadow-xl shadow-primary/20"
          >
            <span className="relative z-10">{HERO_CONTENT[textIndex].cta}</span>
            <div className="absolute inset-0 bg-foreground/10 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
