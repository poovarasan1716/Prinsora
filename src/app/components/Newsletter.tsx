'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal">
          <span className="inline-block w-12 h-0.5 bg-accent mb-6" />
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Stay in the Loop</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-4">
            Join the Prinsora Circle
          </h2>
          <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto leading-relaxed">
            Get early access to new arrivals, exclusive offers, and style inspiration delivered to your inbox.
          </p>

          {submitted ? (
            <div className="animate-scale-in flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-semibold text-foreground text-lg font-display">Welcome to the Circle!</p>
              <p className="text-sm text-muted-foreground">Check your inbox for a ₹200 welcome coupon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 bg-white border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-primary text-white font-semibold text-sm rounded-full hover:bg-accent hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">No spam, unsubscribe anytime. ✦ Get ₹200 off your first order.</p>
        </div>
      </div>
    </section>
  );
}