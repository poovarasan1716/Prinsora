'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const related = [
{
  id: 1,
  name: 'Kavya Palazzo Set',
  price: 2199,
  originalPrice: 3200,
  img: "https://images.unsplash.com/photo-1693989237698-6e763802d741",
  alt: 'Woman in palazzo pants with embroidered top, relaxed ethnic wear, outdoor setting'
},
{
  id: 2,
  name: 'Meera Embroidered Dress',
  price: 3299,
  originalPrice: 4500,
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1d85128e5-1773224799006.png",
  alt: 'Woman in embroidered ethnic dress with floral motifs, festive occasion, warm lighting'
},
{
  id: 3,
  name: 'Radha Silk Saree',
  price: 4999,
  originalPrice: 7500,
  img: "https://images.unsplash.com/photo-1730390753040-c283d826d2f6",
  alt: 'Woman in luxurious silk saree with gold border, festive occasion, warm lighting'
},
{
  id: 4,
  name: 'Rose Gold Lehenga',
  price: 8999,
  originalPrice: 12000,
  img: "https://images.unsplash.com/photo-1732508531407-ea058467a83d",
  alt: 'Woman in rose gold lehenga with heavy embroidery, bridal occasion, festive wear'
}];


export default function RelatedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            You May Also Like
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center hover:border-accent hover:text-accent transition-all"
              aria-label="Scroll left">
              
              <Icon name="ChevronLeftIcon" size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center hover:border-accent hover:text-accent transition-all"
              aria-label="Scroll right">
              
              <Icon name="ChevronRightIcon" size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {related.map((item) =>
          <Link
            key={item.id}
            href="/product-detail"
            className="product-card group flex-shrink-0 w-56 sm:w-64 bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1">
            
              <div className="relative overflow-hidden aspect-[3/4]">
                <AppImage
                src={item.img}
                alt={item.alt}
                fill
                className="product-card-img object-cover object-top"
                sizes="256px" />
              
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-primary font-display">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{item.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}