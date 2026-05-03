'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, ShoppingBag, Truck, Users } from 'lucide-react';
import dynamic from 'next/dynamic';

const Model3DViewer = dynamic(() => import('./Model3DViewer'), {
  ssr: false,
});


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Design Color Background */}
      <div className="absolute inset-0 z-0 bg-zinc-950 overflow-hidden pointer-events-none">
        {/* Animated glowing orbs */}
        <motion.div
          animate={{
            x: [0, 150, -100, 0],
            y: [0, -150, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent/20 rounded-full blur-[100px] lg:blur-[120px] opacity-70"
        />
        <motion.div
          animate={{
            x: [0, -150, 100, 0],
            y: [0, 150, -100, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[0%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-accent/30 rounded-full blur-[80px] lg:blur-[100px] opacity-60"
        />
        <motion.div
          animate={{
            x: [0, 100, -100, 0],
            y: [0, 100, -100, 0],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-900/40 rounded-full blur-[80px] lg:blur-[100px] opacity-50"
        />
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
      </div>

      {/* Fullscreen 3D Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Model3DViewer />
      </div>

      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-40 lg:pb-32 pointer-events-none"
      >
        <div className="max-w-2xl pointer-events-auto">
          {/* Label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/60 bg-accent/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">
              New Collection 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Style That
            <br />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-accent italic font-light inline-block"
            >
              Defines You
            </motion.span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-lg mb-10"
          >
            Discover Prinsora's curated collection — where every thread carries grace and every silhouette tells your story.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary font-semibold text-sm rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-accent/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/50 text-white font-semibold text-sm rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </motion.div>
      {/* Floating Stats Strip */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, type: "spring" }}
        className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-auto z-20"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/20 px-6 py-5 flex flex-col sm:flex-row gap-5 sm:gap-10 lg:gap-12 items-start sm:items-center lg:w-auto">
          {[
            { value: '2,000+', label: 'Styles Available', icon: ShoppingBag },
            { value: '50,000+', label: 'Happy Customers', icon: Users },
            { value: '4.9★', label: 'Average Rating', icon: Star },
            { value: 'Free', label: 'Shipping ₹999+', icon: Truck },
          ]?.map(({ value, label, icon: Icon }, i) => (
            <React.Fragment key={label}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-default"
              >
                <div className="p-2 bg-accent/10 rounded-full">
                   <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary font-display">{value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                </div>
              </motion.div>
              {i < 3 && <div className="hidden sm:block w-px h-10 bg-border" />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </section>
  );
}