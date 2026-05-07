import { motion } from 'framer-motion';
import { Gem, Leaf, Award } from 'lucide-react';

const pillars = [
  {
    icon: Gem,
    title: 'Artisan Craft',
    desc: 'Every piece is handcrafted by master weavers with generations of textile heritage.',
  },
  {
    icon: Leaf,
    title: 'Ethically Sourced',
    desc: 'We partner with sustainable farms and cooperatives to honor both craft and planet.',
  },
  {
    icon: Award,
    title: 'Uncompromised Quality',
    desc: 'From silk threads to final stitches, every detail passes our 47-point quality check.',
  },
];

export function About() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#fdfaf4' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 90% 10%, hsl(45 80% 60% / 0.07), transparent)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/35 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-4 font-semibold"
              style={{ color: 'hsl(38 80% 45%)' }}
            >
              Our Story
            </p>
            <h2
              className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-6"
              style={{
                background:
                  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 8px hsl(45 70% 45% / 0.35))',
              }}
            >
              Where Heritage <br />
              <span className="italic">Meets Couture</span>
            </h2>
            <div
              className="w-20 h-0.5 mb-8"
              style={{ background: 'linear-gradient(to right, hsl(45 70% 55%), transparent)' }}
            />
            <p className="leading-relaxed text-lg mb-6 font-light" style={{ color: '#5a3a28' }}>
              Born from a love of India&apos;s rich textile legacy, Prinsora was founded with a
              singular purpose — to bring the soul of traditional Indian weaving into the modern
              wardrobe, without compromise.
            </p>
            <p className="leading-relaxed font-light" style={{ color: '#6b4a35' }}>
              Each silhouette in our collection is a conversation between centuries of craftsmanship
              and contemporary design sensibility. We believe luxury isn&apos;t a price point —
              it&apos;s the feeling of wearing something made entirely for you.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="flex items-start gap-5 p-6 rounded-xl group transition-all duration-300"
                style={{
                  background: '#fff',
                  border: '1px solid hsl(45 70% 55% / 0.15)',
                  boxShadow: '0 4px 20px hsl(45 70% 55% / 0.08)',
                }}
                whileHover={{
                  boxShadow: '0 8px 32px hsl(45 70% 55% / 0.2)',
                  borderColor: 'hsl(45 70% 55% / 0.35)',
                  y: -3,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 80% 55%), hsl(38 90% 48%))',
                    boxShadow: '0 4px 14px hsl(45 70% 55% / 0.4)',
                  }}
                >
                  <p.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="font-serif text-xl font-semibold mb-2"
                    style={{ color: '#1a0f08' }}
                  >
                    {p.title}
                  </h3>
                  <p className="font-light leading-relaxed text-sm" style={{ color: '#5a3a28' }}>
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
    </section>
  );
}
