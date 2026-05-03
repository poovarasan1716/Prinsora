'use client';
import React, { useState } from 'react';

import Icon from '@/components/ui/AppIcon';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Maroon', hex: '#7B2D3E' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Forest Green', hex: '#2D5A27' },
  { name: 'Gold', hex: '#C9A84C' },
];

export default function ProductInfo({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'care'>('description');

  if (!product) return <div className="space-y-4 py-4 animate-pulse"><div className="h-8 bg-secondary rounded w-3/4"></div><div className="h-6 bg-secondary rounded w-1/2"></div></div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const discount = Math.round((product.originalPrice - product.price) / product.originalPrice * 100);

  return (
    <div className="py-2 lg:py-4">
      {/* Category + Badge */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-accent">{product.category}</span>
        {product.badge && <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[11px] font-bold">{product.badge}</span>}
      </div>

      {/* Name */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight leading-tight mb-3">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'text-accent' : 'text-muted'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">{product.rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
        <span className="text-sm text-green-600 font-medium">● In Stock</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
        <span className="font-display text-4xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
        <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
        <span className="px-2.5 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-lg">{discount}% OFF</span>
      </div>

      {/* Color */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-foreground">Color</label>
          <span className="text-sm text-accent font-medium">{selectedColor}</span>
        </div>
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              title={color.name}
              className={`w-8 h-8 rounded-full transition-all duration-200 ${
                selectedColor === color.name ? 'ring-2 ring-offset-2 ring-accent scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-foreground">Size</label>
          <button className="text-sm text-accent hover:text-primary transition-colors flex items-center gap-1">
            Size Guide
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                selectedSize === size
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-foreground border-border hover:border-accent hover:text-accent'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-xs text-muted-foreground mt-2">Please select a size to continue</p>
        )}
      </div>

      {/* Quantity */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-foreground block mb-3">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-xl border border-border bg-white hover:border-accent hover:text-accent transition-all flex items-center justify-center font-bold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center font-bold text-lg text-foreground font-display">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-xl border border-border bg-white hover:border-accent hover:text-accent transition-all flex items-center justify-center font-bold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            addedToCart
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
              : 'bg-primary text-white hover:bg-accent hover:text-primary hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5'
          }`}
        >
          <Icon name="ShoppingBagIcon" size={18} />
          {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>
        <button className="flex-1 py-4 rounded-2xl font-semibold text-sm bg-accent text-primary hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5">
          Buy Now
        </button>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
            wishlisted ? 'border-red-400 bg-red-50' : 'border-border hover:border-accent'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon
            name="HeartIcon"
            variant={wishlisted ? 'solid' : 'outline'}
            size={20}
            className={wishlisted ? 'text-red-500' : 'text-muted-foreground'}
          />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-secondary rounded-2xl">
        {[
          { icon: 'TruckIcon', label: 'Free Delivery', sub: 'On orders ₹999+' },
          { icon: 'ArrowPathIcon', label: 'Easy Returns', sub: '7-day return' },
          { icon: 'ShieldCheckIcon', label: 'Authentic', sub: '100% genuine' },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="text-center">
            <div className="flex justify-center mb-1">
              <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-accent" />
            </div>
            <p className="text-xs font-semibold text-foreground">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-border mb-4">
          {(['description', 'details', 'care'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-accent text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'description' ? 'Description' : tab === 'details' ? 'Product Details' : 'Care Instructions'}
            </button>
          ))}
        </div>
        <div className="text-sm text-foreground/80 leading-relaxed">
          {activeTab === 'description' && (
            <p>
              The Ananya Floral Anarkali is a timeless piece crafted for the modern woman who cherishes tradition.
              Made from premium georgette fabric with intricate gold zari embroidery, this anarkali features a
              flared silhouette with a fitted bodice. Comes with a matching dupatta and churidar.
              Perfect for festive occasions, weddings, and celebrations.
            </p>
          )}
          {activeTab === 'details' && (
            <ul className="space-y-2">
              {[
                ['Fabric', 'Premium Georgette with Zari Embroidery'],
                ['Fit', 'Regular Fit, Flared Anarkali'],
                ['Length', 'Floor Length (Maxi)'],
                ['Dupatta', 'Included (Matching Georgette)'],
                ['Occasion', 'Festival, Wedding, Celebration'],
                ['Country of Origin', 'India'],
              ].map(([key, val]) => (
                <li key={key} className="flex gap-3">
                  <span className="font-semibold text-foreground w-32 flex-shrink-0">{key}:</span>
                  <span className="text-muted-foreground">{val}</span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'care' && (
            <ul className="space-y-2">
              {[
                'Dry clean only recommended',
                'Do not wring or tumble dry',
                'Iron on low heat with pressing cloth',
                'Store in garment bag away from direct sunlight',
                'Handle embroidery with care',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✦</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}