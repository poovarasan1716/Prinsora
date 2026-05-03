'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          // Assuming new arrivals are the first 5 products or filtered by a badge
          setArrivals(data.products.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
    }
    return () => el?.removeEventListener('scroll', checkScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="reveal">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Just Dropped</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              New Arrivals
            </h2>
          </div>
          <div className="reveal reveal-delay-1 flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-accent hover:bg-accent hover:text-primary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left">
              
              <Icon name="ChevronLeftIcon" size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-accent hover:bg-accent hover:text-primary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right">
              
              <Icon name="ChevronRightIcon" size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : arrivals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground italic">New arrivals coming soon...</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {arrivals.map((item) =>
            <Link
              key={item.id}
              href={`/product-detail?id=${item.id}`}
              className="product-card group flex-shrink-0 w-56 sm:w-64 bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1">
              
                <div className="relative overflow-hidden aspect-[3/4]">
                  <AppImage
                  src={item.img}
                  alt={item.alt}
                  fill
                  className="product-card-img object-cover object-top"
                  sizes="256px" />
                
                  {(item.badge || item.isNew) &&
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent text-primary">
                      {item.badge || 'New'}
                    </span>
                  }
                </div>
                <div className="p-3">
                  <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 mb-1">
                    {item.name}
                  </h3>
                  <p className="font-bold text-primary font-display">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>);
}