'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const shipping = cartTotal >= 999 ? 0 : 99;
  const discount = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + shipping - discount;

  const handleRemove = (id: string, size: string) => {
    setRemovingId(id + size);
    setTimeout(() => {
      removeFromCart(id, size);
      setRemovingId(null);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium">Shopping Cart</span>
        </div>

        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-primary mb-2">
          Your Cart
        </h1>
        <p className="text-muted-foreground mb-10">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
        </p>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Icon name="ShoppingBagIcon" size={40} className="text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Looks like you haven't added anything yet. Explore our collection and find something you love.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id + item.size}
                  className={`bg-card rounded-2xl p-4 sm:p-6 border border-border flex gap-4 sm:gap-6 transition-all duration-300 ${
                    removingId === item.id + item.size ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                    <AppImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: <span className="text-foreground font-medium">{item.size}</span>
                          {' · '}
                          Color: <span className="text-foreground font-medium">{item.color}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.size)}
                        className="p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 border border-border rounded-full px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-7 h-7 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Icon name="MinusIcon" size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-7 h-7 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Icon name="PlusIcon" size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-primary text-base sm:text-lg">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        {item.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Icon name="TagIcon" size={16} className="text-accent" />
                  Apply Coupon
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="font-display text-xl font-semibold text-primary mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount (5%)</span>
                    <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                      🎉 You've unlocked free shipping!
                    </p>
                  )}
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2">
                      Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-border mt-5 pt-5">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 animate-gold-pulse"
                >
                  Proceed to Checkout
                  <Icon name="ArrowRightIcon" size={18} />
                </Link>

                <Link
                  href="/shop"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Trust badges */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: 'ShieldCheckIcon', label: 'Secure Payment' },
                    { icon: 'TruckIcon', label: 'Fast Delivery' },
                    { icon: 'ArrowPathIcon', label: 'Easy Returns' },
                  ].map((badge) => (
                    <div key={badge.label} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <Icon name={badge.icon as any} size={16} className="text-accent" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-tight">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
