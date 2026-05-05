'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import AppImage from '@/components/ui/AppImage';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState('M');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.products?.find((p: any) => p.id === id);
        if (found) {
          setProduct(found);
          // Set default size if available
          if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
          }
        }
      })
      .catch(err => console.error('Failed to fetch product details:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0805' }}>
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0805' }}>
        <div className="text-center">
          <p className="text-2xl font-serif mb-4" style={{ color: 'hsl(45 70% 55%)' }}>Product not found</p>
          <button onClick={() => router.push('/shop')} className="px-6 py-2 rounded-full text-sm" style={{ background: BTN_GOLD, color: '#1a0f08' }}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      localStorage.setItem('prinsora_redirect', `/product/${product.id}`);
      toast({ title: 'Login Required', description: 'Please sign in to add items to your cart.' });
      router.push('/login');
      return;
    }
    setAddingToCart(true);
    await new Promise(r => setTimeout(r, 600));
    addItem(product, selectedSize);
    setAddingToCart(false);
    toast({ title: '✦ Added to Cart', description: `${product.name} (Size: ${selectedSize}) added to cart.` });
  };

  const handleBuyNow = () => {
    if (!user) {
      localStorage.setItem('prinsora_redirect', `/product/${product.id}`);
      toast({ title: 'Login Required', description: 'Please sign in to continue.' });
      router.push('/login');
      return;
    }
    addItem(product, selectedSize);
    router.push('/cart');
  };

  const liked = isLiked(product.id);

  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <button
            onClick={() => router.push('/shop')}
            className="flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: 'hsl(45 70% 55%)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{ height: '560px', border: '1px solid hsl(45 70% 55% / 0.2)', boxShadow: '0 0 60px hsl(45 70% 55% / 0.08)' }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <AppImage src={product.image} alt={product.name} fill className="object-cover" />
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: BTN_GOLD, color: '#1a0f08' }}>
                  {product.tag}
                </span>
              )}
              <motion.button
                onClick={() => { toggle(product.id); toast({ title: liked ? 'Removed from Wishlist' : '♡ Saved to Wishlist', description: '' }); }}
                className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(15,8,5,0.85)', border: '1px solid hsl(45 70% 55% / 0.4)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-5 h-5" style={liked ? { fill: 'hsl(45 70% 55%)', color: 'hsl(45 70% 55%)' } : { color: 'hsl(45 70% 55%)' }} />
              </motion.button>
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-2" style={{ color: 'hsl(45 70% 55%)' }}>{product.category}</p>
                <h1 className="text-4xl font-serif font-medium mb-3" style={{ background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ fill: i < Math.floor(product.rating) ? 'hsl(38 80% 55%)' : 'transparent', color: 'hsl(38 80% 55%)' }} />
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: 'hsl(38 60% 55%)' }}>{product.rating} · {product.reviews} reviews</span>
                </div>
              </div>

              <div className="h-px" style={{ background: 'hsl(45 70% 55% / 0.2)' }} />

              <div>
                <span className="text-3xl font-bold" style={{ color: 'hsl(45 75% 58%)' }}>{formatPrice(product.price)}</span>
                <span className="text-sm ml-2" style={{ color: 'hsl(38 30% 50%)' }}>Inclusive of all taxes</span>
              </div>

              <div>
                <p className="text-sm font-medium mb-3" style={{ color: 'hsl(38 60% 65%)' }}>Select Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200"
                      style={selectedSize === size ? {
                        background: BTN_GOLD,
                        color: '#1a0f08',
                        border: '1px solid transparent',
                      } : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid hsl(45 70% 55% / 0.3)',
                        color: '#f5f0e8',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm leading-relaxed font-light" style={{ color: 'hsl(38 30% 65%)' }}>
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm"
                  style={{ background: BTN_GOLD, color: '#1a0f08' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addingToCart ? 'Adding…' : 'Add to Cart'}
                </motion.button>
                <motion.button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 rounded-full font-semibold text-sm"
                  style={{ border: '1.5px solid hsl(45 70% 55%)', color: 'hsl(45 70% 60%)', background: 'transparent' }}
                  whileHover={{ background: 'hsl(45 70% 55% / 0.1)', scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Now
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { icon: ShieldCheck, label: 'Authentic', sub: '100% genuine' },
                  { icon: Truck, label: 'Free Delivery', sub: 'Orders ₹25k+' },
                  { icon: RefreshCw, label: 'Easy Returns', sub: '7-day policy' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.12)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'hsl(45 70% 55%)' }} />
                    <p className="text-xs font-semibold" style={{ color: '#f5f0e8' }}>{label}</p>
                    <p className="text-[10px]" style={{ color: 'hsl(38 30% 50%)' }}>{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
