'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleMoveToCart = (item: typeof wishlistItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      size: 'M',
      color: 'Default',
      quantity: 1,
    });
    setAddedIds((prev) => new Set([...prev, item.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium">Wishlist</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-primary mb-1">My Wishlist</h1>
            <p className="text-muted-foreground">{wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}</p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={() => wishlistItems.forEach((item) => handleMoveToCart(item))}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all"
            >
              <Icon name="ShoppingBagIcon" size={16} />
              Move All to Cart
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Icon name="HeartIcon" size={40} className="text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Save your favourite pieces here and come back to them anytime.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <AppImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover product-card-img"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.originalPrice && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 text-foreground"
                    aria-label="Remove from wishlist"
                    style={{ top: item.originalPrice ? '2.5rem' : '0.75rem' }}
                  >
                    <Icon name="XMarkIcon" size={16} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-primary">₹{item.price.toLocaleString('en-IN')}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedIds.has(item.id)
                        ? 'bg-green-500 text-white' :'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md'
                    }`}
                  >
                    {addedIds.has(item.id) ? (
                      <>
                        <Icon name="CheckIcon" size={16} />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <Icon name="ShoppingBagIcon" size={16} />
                        Move to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
