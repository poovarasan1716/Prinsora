'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function OfferBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }),
      { threshold: 0.2 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 lg:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-3xl bg-primary px-8 py-12 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-accent/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-4">
              Limited Time Offer
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
              Up to <span className="text-accent">50% OFF</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              On selected ethnic wear, sarees, and festive collections. Don't miss out!
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Countdown visual */}
            <div className="flex items-center gap-3">
              {['12', '45', '30']?.map((num, i) => (
                <React.Fragment key={i}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="font-display text-2xl font-bold text-white">{num}</span>
                    </div>
                    <span className="text-xs text-white/50 mt-1 block">
                      {['HRS', 'MIN', 'SEC']?.[i]}
                    </span>
                  </div>
                  {i < 2 && <span className="text-white/40 text-2xl font-bold -mt-4">:</span>}
                </React.Fragment>
              ))}
            </div>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-accent text-primary font-semibold text-sm rounded-full hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Shop the Sale →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}