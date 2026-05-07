import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

function getTimeLeft() {
  const end = new Date();
  end.setDate(end.getDate() + 3);
  end.setHours(23, 59, 59, 0);
  const diff = Math.max(0, end.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="px-4 py-3 min-w-[68px] text-center rounded-lg"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid hsl(45 70% 55% / 0.4)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <span
          className="text-3xl md:text-4xl font-serif font-bold tabular-nums"
          style={{ color: '#fff', textShadow: '0 0 20px hsl(45 70% 55% / 0.6)' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span
        className="text-[10px] tracking-[0.2em] uppercase font-medium"
        style={{ color: 'hsl(45 80% 65%)' }}
      >
        {label}
      </span>
    </div>
  );
}

export function SaleCta() {
  const router = useRouter();
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#0f0805' }}>
      {/* Rich layered gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, hsl(38 70% 40% / 0.12), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 20% 80%, hsl(45 80% 50% / 0.06), transparent)',
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, hsl(45 70% 55% / 0.5), transparent)',
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, hsl(45 70% 55% / 0.4), transparent)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl p-10 md:p-16 relative overflow-hidden"
            style={{
              border: '1px solid hsl(45 70% 55% / 0.25)',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(201,168,76,0.04) 100%)',
              boxShadow: '0 0 80px hsl(45 70% 55% / 0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Corner blobs */}
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, hsl(45 70% 55% / 0.06), transparent 70%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, hsl(38 80% 50% / 0.05), transparent 70%)',
              }}
            />

            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
              <motion.div
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-4 font-medium"
                  style={{ color: 'hsl(45 80% 60%)' }}
                >
                  Limited Time Offer
                </p>
                <h2
                  className="text-4xl md:text-5xl font-serif leading-tight mb-3"
                  style={{
                    background:
                      'linear-gradient(135deg, #C8922A 0%, #F5D47A 35%, #FFE999 50%, #D4A843 70%, #A06A10 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px hsl(45 70% 55% / 0.5))',
                  }}
                >
                  The <span className="italic">Royal</span>
                  <br />
                  Festive Sale
                </h2>
                <p className="mt-3 mb-8 text-lg font-light" style={{ color: 'hsl(38 30% 70%)' }}>
                  Up to{' '}
                  <span
                    className="font-bold"
                    style={{
                      color: 'hsl(45 90% 65%)',
                      textShadow: '0 0 12px hsl(45 70% 55% / 0.5)',
                    }}
                  >
                    40% Off
                  </span>{' '}
                  on select collections.
                  <br className="hidden md:block" />
                  Luxury, redefined for every celebration.
                </p>
                <motion.button
                  data-testid="button-shop-sale"
                  onClick={() => router.push('/shop')}
                  className="px-10 py-4 font-semibold tracking-wide rounded-lg text-sm"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 80% 55%), hsl(38 90% 48%))',
                    color: '#1a0800',
                    boxShadow: '0 4px 24px hsl(45 70% 55% / 0.35)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 36px hsl(45 70% 55% / 0.55)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Shop the Sale
                </motion.button>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-5"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <p
                  className="text-xs tracking-[0.25em] uppercase font-medium"
                  style={{ color: 'hsl(38 30% 60%)' }}
                >
                  Ends in
                </p>
                <div className="flex items-start gap-3">
                  <TimeBlock value={time.days} label="Days" />
                  <span className="text-2xl font-serif mt-3" style={{ color: 'hsl(45 80% 55%)' }}>
                    :
                  </span>
                  <TimeBlock value={time.hours} label="Hours" />
                  <span className="text-2xl font-serif mt-3" style={{ color: 'hsl(45 80% 55%)' }}>
                    :
                  </span>
                  <TimeBlock value={time.minutes} label="Mins" />
                  <span className="text-2xl font-serif mt-3" style={{ color: 'hsl(45 80% 55%)' }}>
                    :
                  </span>
                  <TimeBlock value={time.seconds} label="Secs" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
