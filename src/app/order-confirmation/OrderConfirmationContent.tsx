'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const orderItems = [
  {
    name: 'Ananya Silk Kurta Set',
    size: 'M',
    qty: 1,
    price: 2499,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80',
  },
  {
    name: 'Zara Floral Maxi Dress',
    size: 'S',
    qty: 2,
    price: 1899,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&q=80',
  },
];

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'PNS12345678';
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStep(1), 100);
    const t2 = setTimeout(() => setAnimStep(2), 600);
    const t3 = setTimeout(() => setAnimStep(3), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Animation */}
        <div className="text-center mb-10">
          <div
            className={`relative w-28 h-28 mx-auto mb-6 transition-all duration-700 ${
              animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <div
              className={`absolute inset-0 rounded-full border-4 border-accent transition-all duration-1000 ${
                animStep >= 2 ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
              }`}
            />
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-2xl shadow-accent/30">
              <div
                className={`transition-all duration-500 delay-300 ${
                  animStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              >
                <Icon name="CheckIcon" size={48} className="text-white" />
              </div>
            </div>
            {animStep >= 3 && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-accent animate-ping"
                    style={{
                      top: `${50 + 55 * Math.sin((i * Math.PI * 2) / 6)}%`,
                      left: `${50 + 55 * Math.cos((i * Math.PI * 2) / 6)}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1.5s',
                    }}
                  />
                ))}
              </>
            )}
          </div>

          <div
            className={`transition-all duration-700 delay-500 ${
              animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-2">
              Order Confirmed! 🎉
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Thank you for shopping with Prinsora. Your order has been placed successfully.
            </p>
          </div>
        </div>

        {/* Order Info Card */}
        <div
          className={`bg-card rounded-2xl border border-border overflow-hidden mb-6 transition-all duration-700 delay-700 ${
            animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">Order ID</p>
              <p className="text-primary-foreground font-bold text-lg font-display">#{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">Estimated Delivery</p>
              <p className="text-accent font-semibold text-sm">{estimatedDelivery}</p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                    <AppImage src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Size: {item.size} · Qty: {item.qty}</p>
                  </div>
                  <span className="font-semibold text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-5 pt-5 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount (5%)</span>
                <span>-₹{Math.round(total * 0.05).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total Paid</span>
                <span className="text-primary">₹{Math.round(total * 0.95).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="MapPinIcon" size={16} className="text-accent" />
                <span className="text-sm font-semibold">Delivery Address</span>
              </div>
              <p className="text-sm text-muted-foreground">Priya Sharma</p>
              <p className="text-sm text-muted-foreground">204, Sunshine Apartments, Linking Road, Mumbai, Maharashtra - 400054</p>
            </div>
          </div>
        </div>

        {/* Tracking Steps */}
        <div
          className={`bg-card rounded-2xl border border-border p-6 mb-8 transition-all duration-700 delay-1000 ${
            animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="font-semibold mb-5">Order Tracking</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div className="absolute top-5 left-0 w-1/4 h-0.5 bg-accent" />
            {[
              { label: 'Order Placed', icon: 'CheckCircleIcon', done: true },
              { label: 'Processing', icon: 'CogIcon', done: false },
              { label: 'Shipped', icon: 'TruckIcon', done: false },
              { label: 'Delivered', icon: 'HomeIcon', done: false },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.done ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  <Icon name={step.icon as any} size={18} />
                </div>
                <span className={`text-xs font-medium text-center ${step.done ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-1000 ${
            animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg"
          >
            <Icon name="ShoppingBagIcon" size={18} />
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="flex-1 flex items-center justify-center gap-2 py-4 border border-border rounded-full font-semibold hover:bg-secondary transition-colors"
          >
            <Icon name="ClipboardDocumentListIcon" size={18} />
            Track My Order
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
