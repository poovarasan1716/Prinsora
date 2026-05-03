'use client';
import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';

const reviews = [
{
  name: 'Sneha Patel',
  location: 'Ahmedabad',
  rating: 5,
  date: '12 Apr 2026',
  review: 'Absolutely gorgeous! The embroidery is stunning and the fabric feels luxurious. Got so many compliments at my cousin\'s wedding.',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1ecb4aca8-1763296537332.png",
  alt: 'Indian woman smiling, casual portrait, professional headshot',
  verified: true,
  helpful: 18
},
{
  name: 'Divya Krishnan',
  location: 'Chennai',
  rating: 4,
  date: '3 Apr 2026',
  review: 'Beautiful anarkali, the colour is exactly as shown. Slight delay in delivery but the packaging was premium — tissue wrapped with a handwritten note.',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1614663f3-1772258592480.png",
  alt: 'Young South Indian woman smiling, casual portrait',
  verified: true,
  helpful: 11
},
{
  name: 'Ritu Agarwal',
  location: 'Jaipur',
  rating: 5,
  date: '28 Mar 2026',
  review: 'Third purchase from Prinsora and they never disappoint! The sizing is accurate and the quality is consistently excellent.',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_122cae39d-1772204764073.png",
  alt: 'Young North Indian woman with warm smile, casual indoor portrait',
  verified: true,
  helpful: 24
}];


export default function ProductReviews() {
  const [helpfulClicked, setHelpfulClicked] = useState<number[]>([]);

  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) =>
                <svg key={s} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </div>
              <span className="font-bold text-lg text-foreground font-display">4.8</span>
              <span className="text-muted-foreground text-sm">based on 124 reviews</span>
            </div>
          </div>
          <button className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-accent hover:text-primary transition-all duration-300 self-start sm:self-auto">
            Write a Review
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-card rounded-2xl p-6 mb-8 border border-border">
          <div className="space-y-2">
            {[
            { stars: 5, count: 89, pct: 72 },
            { stars: 4, count: 24, pct: 19 },
            { stars: 3, count: 7, pct: 6 },
            { stars: 2, count: 3, pct: 2 },
            { stars: 1, count: 1, pct: 1 }].
            map(({ stars, count, pct }) =>
            <div key={stars} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-4">{stars}</span>
                <svg className="w-3 h-3 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${pct}%` }} />
                
                </div>
                <span className="text-xs text-muted-foreground w-6">{count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-5">
          {reviews.map((review, i) =>
          <div key={i} className="bg-card rounded-2xl p-6 border border-border hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <AppImage
                    src={review.img}
                    alt={review.alt}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover" />
                  
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{review.name}</p>
                      {review.verified &&
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                          ✓ Verified
                        </span>
                    }
                    </div>
                    <p className="text-xs text-muted-foreground">{review.location} · {review.date}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) =>
                <svg
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-accent' : 'text-muted'}`}
                  fill="currentColor" viewBox="0 0 20 20">
                  
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">{review.review}</p>
              <div className="flex items-center gap-4">
                <button
                onClick={() => setHelpfulClicked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                helpfulClicked.includes(i) ? 'text-accent font-semibold' : 'text-muted-foreground hover:text-foreground'}`
                }>
                
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Helpful ({review.helpful + (helpfulClicked.includes(i) ? 1 : 0)})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}