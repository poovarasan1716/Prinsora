import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import col1 from '@/assets/images/collection-1.png';
import col2 from '@/assets/images/collection-2.png';
import col3 from '@/assets/images/collection-3.png';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

const collections = [
  { id: 1, name: 'Royal', tagline: 'Timeless Grandeur', category: 'Saree', image: col1 },
  { id: 2, name: 'Festive', tagline: 'Celebrate in Gold', category: 'Lehenga', image: col2 },
  { id: 3, name: 'Fusion', tagline: 'East Meets West', category: 'Gown', image: col3 },
];

export function Collections() {
  const router = useRouter();

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#ffffff' }}>
      {/* Subtle gold radial glow top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 10% 20%, hsl(45 90% 60% / 0.06), transparent)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
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
            Explore the Range
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
            Our Collections
          </h2>
          <div
            className="w-20 h-0.5 mx-auto mt-6"
            style={{
              background: 'linear-gradient(to right, transparent, hsl(45 70% 55%), transparent)',
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              data-testid={`collection-card-${col.id}`}
              className="group relative overflow-hidden cursor-pointer"
              style={{
                height: '320px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px hsl(45 70% 55% / 0.12)',
                border: '1px solid hsl(45 70% 55% / 0.2)',
              }}
              onClick={() => router.push('/shop')}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -6, boxShadow: '0 24px 60px hsl(45 70% 55% / 0.3)' }}
            >
              <AppImage
                src={col.image}
                alt={col.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark gradient reveal */}
              <div
                className="absolute inset-0 transition-all duration-400"
                style={{
                  background:
                    'linear-gradient(to top, rgba(15,8,2,0.85) 0%, rgba(15,8,2,0.1) 45%, transparent 100%)',
                }}
              />

              {/* Gold border glow on hover */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: 'inset 0 0 0 1.5px hsl(45 80% 55% / 0.6)' }}
              />

              <div className="absolute inset-x-0 bottom-0 p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <p
                  className="text-xs tracking-[0.25em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: 'hsl(45 90% 65%)' }}
                >
                  {col.tagline}
                </p>
                <h3
                  className="font-serif text-3xl font-semibold"
                  style={{
                    color: '#fff',
                    textShadow: '0 2px 12px hsl(45 70% 55% / 0.5)',
                  }}
                >
                  {col.name}
                </h3>
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <span className="text-sm font-medium" style={{ color: 'hsl(45 90% 65%)' }}>
                    Explore
                  </span>
                  <div className="h-px w-8" style={{ background: 'hsl(45 90% 65%)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shop All Collections button */}
        <div className="text-center mt-12">
          <motion.button
            onClick={() => router.push('/shop')}
            className="px-10 py-3.5 rounded-full text-sm font-semibold tracking-wider"
            style={{
              border: '1.5px solid hsl(45 70% 55% / 0.5)',
              color: 'hsl(38 70% 40%)',
              background: 'transparent',
            }}
            whileHover={{
              background: 'hsl(45 70% 55% / 0.08)',
              borderColor: 'hsl(45 70% 55%)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            Shop All Collections
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
    </section>
  );
}
