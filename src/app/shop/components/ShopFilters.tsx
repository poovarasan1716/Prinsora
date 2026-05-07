'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const categories = ['All', 'Dresses', 'Sarees', 'Kurtis', 'Tops', 'Ethnic Wear', 'Lehengas'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Gold', hex: '#C9A84C' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#9333EA' },
  { name: 'White', hex: '#F9FAFB', border: true },
  { name: 'Black', hex: '#111827' },
];

export default function ShopFilters() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleColor = (c: string) =>
    setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filterContent = (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide mb-4">
          Category
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-secondary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide mb-4">
          Price Range
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 rounded-lg text-sm font-medium border transition-all duration-200 ${
                selectedSizes.includes(size)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-foreground border-border hover:border-accent hover:text-accent'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide mb-4">
          Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={`w-8 h-8 rounded-full transition-all duration-200 ${
                selectedColors.includes(color.name)
                  ? 'ring-2 ring-offset-2 ring-accent scale-110'
                  : 'hover:scale-105'
              } ${color.border ? 'border border-border' : ''}`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={() => {
          setSelectedCategory('All');
          setPriceRange([0, 10000]);
          setSelectedSizes([]);
          setSelectedColors([]);
        }}
        className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:border-accent transition-colors mb-4"
      >
        <Icon name="AdjustmentsHorizontalIcon" size={16} />
        Filters
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto animate-slide-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-primary">Filters</h2>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-primary mb-6">Filters</h2>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
