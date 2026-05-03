import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import CategoriesSection from '@/app/components/CategoriesSection';
import FeaturedProducts from '@/app/components/FeaturedProducts';
import NewArrivals from '@/app/components/NewArrivals';
import OfferBanner from '@/app/components/OfferBanner';
import Testimonials from '@/app/components/Testimonials';
import Newsletter from '@/app/components/Newsletter';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <NewArrivals />
      <OfferBanner />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}