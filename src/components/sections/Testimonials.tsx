import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import av1 from '@/assets/images/avatar-1.png';
import av2 from '@/assets/images/avatar-2.png';
import av3 from '@/assets/images/avatar-3.png';
import modelAvatar from '@/assets/images/model-avatar.png';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

const feedback = [
  {
    id: 1,
    name: 'Aanya Sharma',
    location: 'Mumbai, India',
    handle: '@aanya.sharma',
    rating: 5,
    product: 'Crimson Royal Saree',
    text: "I wore this Prinsora lehenga to my sister's wedding and the compliments have not stopped. The quality of the zari work is truly breathtaking — every thread tells a story of incredible craftsmanship.",
    avatar: av1,
    verified: true,
  },
  {
    id: 2,
    name: 'Priya Mehta',
    location: 'Delhi, India',
    handle: '@priya.mehta',
    rating: 5,
    product: 'Emerald Zari Lehenga',
    text: "Prinsora understands luxury in the truest sense. My saree draped perfectly, the silk was extraordinarily soft, and the gold borders gleamed beautifully under the lights. Absolutely worth every rupee.",
    avatar: av2,
    verified: true,
  },
  {
    id: 3,
    name: 'Zara Khan',
    location: 'Bangalore, India',
    handle: '@zara.k',
    rating: 5,
    product: 'Golden Silk Royal Saree',
    text: "The Golden Silk saree I purchased is a work of art. The way it shimmered in the evening light was magical. Prinsora truly delivers on its promise of luxury and heritage. I felt like royalty.",
    avatar: modelAvatar,
    verified: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#fff' }}>
      {/* Gold watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-serif font-bold whitespace-nowrap pointer-events-none select-none"
        style={{ color: 'hsl(45 70% 55% / 0.05)' }}
      >
        STORIES
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, hsl(45 80% 60% / 0.05), transparent)' }} />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-3 font-semibold" style={{ color: 'hsl(38 80% 45%)' }}>
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
          <div className="w-20 h-0.5 mx-auto mt-6" style={{ background: 'linear-gradient(to right, transparent, hsl(45 70% 55%), transparent)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {feedback.map((item, index) => (
            <motion.div
              key={item.id}
              data-testid={`testimonial-card-${item.id}`}
              className="flex flex-col rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: '#fff',
                border: '1px solid hsl(45 70% 55% / 0.18)',
                boxShadow: '0 6px 30px hsl(45 70% 55% / 0.1)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -6,
                boxShadow: '0 20px 60px hsl(45 70% 55% / 0.22)',
              }}
            >
              {/* Customer Photo Header */}
              <div className="relative h-48 overflow-hidden relative" style={{ background: 'hsl(38 60% 92%)' }}>
                <AppImage
                  src={item.avatar}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                  style={{ filter: 'brightness(0.98)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.15) 100%)' }} />

                {/* Stars overlay */}
                <div className="absolute top-3 left-3 flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" style={{ fill: 'hsl(38 85% 52%)', color: 'hsl(38 85% 52%)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                  ))}
                </div>

                {/* Verified badge */}
                {item.verified && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'hsl(45 70% 55%)', color: '#1a0f08' }}>
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 gap-4">
                {/* Quote icon */}
                <Quote className="w-6 h-6" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />

                {/* Review text */}
                <p className="leading-relaxed font-light text-sm flex-1" style={{ color: '#4a3020' }}>
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Product purchased */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(45 70% 55%)' }} />
                  <span className="text-[11px] font-medium tracking-wide" style={{ color: 'hsl(38 70% 45%)' }}>
                    Purchased: {item.product}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid hsl(45 70% 55% / 0.15)' }}>
                  <div>
                    <p className="font-semibold font-serif text-sm" style={{ color: '#1a0f08' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: '#8a6040' }}>{item.location}</p>
                  </div>
                  <span className="text-[11px]" style={{ color: 'hsl(45 60% 55%)' }}>{item.handle}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
    </section>
  );
}
