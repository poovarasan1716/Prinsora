import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import AppImage from '@/components/ui/AppImage';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

export function Featured() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products.slice(0, 3));
      })
      .catch(err => console.error('Failed to fetch featured products:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const featured = products;

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      localStorage.setItem('prinsora_redirect', '/');
      toast({ title: 'Login Required', description: 'Please sign in to add items to your cart.' });
      router.push('/login');
      return;
    }
    addItem(product);
    toast({ title: '✦ Added to Cart', description: `${product.name} has been added.` });
  };

  const handleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
    toast({ title: isLiked(id) ? 'Removed from Wishlist' : '♡ Saved to Wishlist', description: '' });
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#fdfaf4' }}>
      {/* Gold watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-bold whitespace-nowrap pointer-events-none select-none z-0"
        style={{ color: 'hsl(45 70% 55% / 0.07)' }}
      >
        FEATURED
      </div>
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-medium" style={{ color: 'hsl(38 80% 45%)' }}>
            Handpicked for You
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
            Curated Excellence
          </h2>
          <div className="w-24 h-0.5 mx-auto mt-6 rounded-full" style={{ background: 'linear-gradient(to right, transparent, hsl(45 70% 55%), transparent)' }} />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'hsl(45 70% 55%)' }} />
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 italic">Curating your exclusive collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                data-testid={`product-card-${product.id}`}
                onClick={() => router.push(`/product/${product.id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group bg-white rounded-xl overflow-hidden cursor-pointer"
                style={{
                  boxShadow: '0 4px 24px hsl(45 70% 55% / 0.1)',
                  border: '1px solid hsl(45 70% 55% / 0.15)',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{ y: -8, boxShadow: '0 16px 50px hsl(45 70% 55% / 0.25)' }}
              >
                {/* Fixed medium height image */}
                <div className="relative overflow-hidden" style={{ height: '240px' }}>
                  <AppImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                  {/* Tag */}
                  {product.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: BTN_GOLD, color: '#1a0f08' }}>
                      {product.tag}
                    </span>
                  )}

                  {/* Rating badge */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#1a0f08' }}
                  >
                    <Star className="w-3 h-3" style={{ fill: 'hsl(38 80% 50%)', color: 'hsl(38 80% 50%)' }} />
                    {product.rating}
                  </div>

                  {/* Wishlist */}
                  <motion.button
                    onClick={e => handleWishlist(e, product.id)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(15,8,5,0.8)', border: '1px solid hsl(45 70% 55% / 0.4)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      className="w-3.5 h-3.5"
                      style={isLiked(product.id) ? { fill: 'hsl(45 70% 55%)', color: 'hsl(45 70% 55%)' } : { color: 'hsl(45 70% 55%)' }}
                    />
                  </motion.button>
                </div>

                <div className="p-5" style={{ background: '#fff' }}>
                  <h3
                    className="font-serif text-lg font-semibold mb-1 transition-colors group-hover:text-yellow-700"
                    style={{ color: '#1a0f08' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: 'hsl(38 50% 50%)' }}>{product.category}</p>
                  <div className="w-10 h-0.5 mb-4 rounded" style={{ background: 'hsl(45 70% 55% / 0.5)' }} />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium" style={{ color: 'hsl(38 60% 40%)' }}>{formatPrice(product.price)}</span>
                    <motion.button
                      onClick={e => handleAddToCart(e, product)}
                      className="p-2.5 rounded-full transition-all duration-200"
                      style={{ background: 'hsl(45 70% 55%)', color: '#fff' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All button */}
        <div className="text-center mt-12">
          <motion.button
            onClick={() => router.push('/shop')}
            className="px-10 py-3.5 rounded-full text-sm font-semibold tracking-wider"
            style={{ background: BTN_GOLD, color: '#1a0f08' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View All Products
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
    </section>
  );
}
