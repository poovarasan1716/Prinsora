'use client';
import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';

export default function ProductGallery({ product }: { product: any }) {
  const images = product ? [
    { src: product.img, alt: product.alt || product.name },
    // placeholders for additional angles if not provided
    { src: product.img, alt: `${product.name} alternate view` },
    { src: product.img, alt: `${product.name} detail view` },
  ] : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  if (!product) return <div className="aspect-[3/4] bg-secondary animate-pulse rounded-2xl" />;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto">
        {images.map((img, i) =>
        <button
          key={i}
          onClick={() => setActiveIdx(i)}
          className={`flex-shrink-0 w-16 h-20 lg:w-20 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
          activeIdx === i ? 'border-accent shadow-md' : 'border-transparent hover:border-border'}`
          }
          aria-label={`View image ${i + 1}`}>
          
            <AppImage
            src={img.src}
            alt={img.alt}
            width={80}
            height={96}
            className="w-full h-full object-cover object-top" />
          
          </button>
        )}
      </div>

      {/* Main Image */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden bg-secondary cursor-zoom-in"
        style={{ minHeight: '420px' }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}>
        
        <div
          className="w-full h-full transition-transform duration-100"
          style={{
            transform: zoomed ? 'scale(1.8)' : 'scale(1)',
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`
          }}>
          
          <AppImage
            src={images[activeIdx].src}
            alt={images[activeIdx].alt}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw" />
          
        </div>

        {/* Zoom hint */}
        {!zoomed &&
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1.5">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              <path d="M11 8v6M8 11h6" strokeLinecap="round" />
            </svg>
            Hover to zoom
          </div>
        }

        {/* Navigation arrows */}
        <button
          onClick={() => setActiveIdx((prev) => (prev - 1 + images.length) % images.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all z-10"
          aria-label="Previous image">
          
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => setActiveIdx((prev) => (prev + 1) % images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all z-10"
          aria-label="Next image">
          
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>);

}