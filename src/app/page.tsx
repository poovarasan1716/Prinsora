'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Featured } from '@/components/sections/Featured';
import { Collections } from '@/components/sections/Collections';
import { About } from '@/components/sections/About';
import { Testimonials } from '@/components/sections/Testimonials';
import { SaleCta } from '@/components/sections/SaleCta';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Featured />
        <Collections />
        <About />
        <Testimonials />
        <SaleCta />
      </main>
      <Footer />
    </div>
  );
}
