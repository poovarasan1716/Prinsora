'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

export function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reviews.length > 0) {
          setReviews(data.reviews.slice(0, 6)); // Show latest 6
        }
      })
      .catch(err => console.error('Failed to fetch stories:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Static fallbacks if no dynamic reviews exist yet
  const fallbackFeedback = [
    {
      userName: 'Aanya Sharma',
      location: 'Mumbai, India',
      rating: 5,
      comment: "I wore this Prinsora lehenga to my sister's wedding and the compliments have not stopped. The quality is truly breathtaking.",
      imageUrl: '',
      timestamp: '2 days ago'
    },
    {
      userName: 'Priya Mehta',
      location: 'Delhi, India',
      rating: 5,
      comment: 'Prinsora understands luxury in the truest sense. My saree draped perfectly, the silk was extraordinarily soft.',
      imageUrl: '',
      timestamp: '1 week ago'
    },
    {
      userName: 'Zara Khan',
      location: 'Bangalore, India',
      rating: 5,
      comment: 'The Golden Silk saree I purchased is a work of art. The way it shimmered in the evening light was magical.',
      imageUrl: '',
      timestamp: '3 days ago'
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackFeedback;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#fff' }}>
      {/* Gold watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-serif font-bold whitespace-nowrap pointer-events-none select-none"
        style={{ color: 'hsl(45 70% 55% / 0.05)' }}
      >
        STORIES
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3 font-semibold"
            style={{ color: 'hsl(38 80% 45%)' }}
          >
            Real Experiences
          </p>
          <h2
            className="text-4xl md:text-6xl font-serif font-medium"
            style={{
              background: GOLD,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 8px hsl(45 70% 45% / 0.35))',
            }}
          >
            Customer Stories
          </h2>
          <div
            className="w-20 h-0.5 mx-auto mt-6"
            style={{
              background: 'linear-gradient(to right, transparent, hsl(45 70% 55%), transparent)',
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-2xl overflow-hidden group"
              style={{
                background: '#fff',
                border: '1px solid hsl(45 70% 55% / 0.15)',
                boxShadow: '0 10px 40px hsl(45 70% 55% / 0.08)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: '0 20px 60px hsl(45 70% 55% / 0.15)' }}
            >
              {item.imageUrl ? (
                <div className="relative h-64 overflow-hidden">
                  <AppImage
                    src={item.imageUrl}
                    alt={item.userName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              ) : (
                <div className="h-4 w-full bg-accent/5" />
              )}

              <div className="p-8 flex flex-col flex-1">
                <Quote className="w-8 h-8 mb-6 opacity-20" style={{ color: 'hsl(45 70% 55%)' }} />
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{
                        fill: i < (item.rating || 5) ? 'hsl(38 85% 52%)' : 'transparent',
                        color: 'hsl(38 85% 52%)',
                      }}
                    />
                  ))}
                </div>

                <p className="text-zinc-700 leading-relaxed italic mb-8 flex-1 text-sm font-light">
                  &ldquo;{item.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <div>
                    <h4 className="font-serif font-bold text-zinc-900">{item.userName}</h4>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{item.location || 'Verified Buyer'}</p>
                  </div>
                  <div className="text-[10px] text-accent font-bold px-2 py-1 rounded bg-accent/5 border border-accent/10">
                    PRINSORA MUSE
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
