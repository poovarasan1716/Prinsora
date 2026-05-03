'use client';
import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const testimonials = [
{
  name: 'Priya Sharma',
  location: 'Mumbai, Maharashtra',
  rating: 5,
  review: 'I ordered the Ananya Anarkali for Diwali and it was absolutely stunning. The fabric quality is exceptional and the gold embroidery is exactly as shown. Delivered in 3 days!',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1ecb4aca8-1763296537332.png",
  alt: 'Smiling Indian woman with warm brown skin, professional headshot, natural light',
  product: 'Ananya Floral Anarkali'
},
{
  name: 'Kavitha Reddy',
  location: 'Bangalore, Karnataka',
  rating: 5,
  review: 'Prinsora has become my go-to for ethnic wear. The Radha Silk Saree drapes beautifully and the colour is even more gorgeous in person. Highly recommend!',
  img: "https://images.unsplash.com/photo-1652396944757-ad27b62b33f6",
  alt: 'Young South Indian woman smiling, casual portrait, natural outdoor light',
  product: 'Radha Silk Saree'
},
{
  name: 'Meera Agarwal',
  location: 'Delhi, NCR',
  rating: 5,
  review: 'The packaging itself feels premium — tissue paper, ribbon, a thank you card. The kurti fits perfectly using their size guide. Will definitely shop again!',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba51baaa-1763300497322.png",
  alt: 'Young North Indian woman with warm smile, casual portrait, indoor soft light',
  product: 'Priya Mirror Kurti'
}];


export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }),
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">What They Say</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Loved by Women Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((t, i) =>
          <div
            key={t?.name}
            className={`reveal reveal-delay-${i + 1} bg-card rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-400 border border-border hover:border-accent/30 hover:-translate-y-1`}>
            
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5]?.map((s) =>
              <svg key={s} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
              )}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 leading-relaxed text-sm mb-6 italic">
                "{t?.review}"
              </p>

              {/* Product tag */}
              <div className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground mb-5">
                Purchased: {t?.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <AppImage
                  src={t?.img}
                  alt={t?.alt}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover" />
                
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t?.name}</p>
                  <p className="text-xs text-muted-foreground">{t?.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}