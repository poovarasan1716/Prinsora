import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopFilters from '@/app/shop/components/ShopFilters';
import ShopGrid from '@/app/shop/components/ShopGrid';

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 lg:pt-24">
        {/* Page Header */}
        <div className="bg-primary text-white py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">All Products</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Shop Collection</h1>
            <p className="text-white/70 mt-2 text-sm">Discover 1,000+ styles curated for the modern woman</p>
          </div>
        </div>

        {/* Shop Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <ShopFilters />
            <ShopGrid />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}