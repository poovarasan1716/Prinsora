'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatPrice, categories } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import AppImage from '@/components/ui/AppImage';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

function ShopContent() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get('tag');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setAllProducts(data.products);
      })
      .catch(err => console.error('Failed to fetch shop products:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = !tagFilter || (p.tag && p.tag.toLowerCase() === tagFilter.toLowerCase());
    return matchCat && matchSearch && matchTag;
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      localStorage.setItem('prinsora_redirect', '/shop');
      toast({ title: 'Login Required', description: 'Please sign in to add items to your cart.' });
      router.push('/login');
      return;
    }
    addItem(product);
    toast({ title: '✦ Added to Cart', description: `${product.name} has been added to your cart.` });
  };

  const handleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
    toast({ title: isLiked(id) ? 'Removed from Wishlist' : '♡ Added to Wishlist', description: '' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="container mx-auto px-4 md:px-6 mb-12">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-3 font-semibold" style={{ color: 'hsl(45 70% 55%)' }}>Explore All</p>
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6" style={{ background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {tagFilter ? `${tagFilter} Collection` : 'Our Collection'}
            </h1>
            <div className="w-20 h-0.5 mx-auto" style={{ background: 'linear-gradient(to right, transparent, hsl(45 70% 55%), transparent)' }} />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={activeCategory === cat ? {
                    background: BTN_GOLD,
                    color: '#1a0f08',
                  } : {
                    border: '1px solid hsl(45 70% 55% / 0.35)',
                    color: 'hsl(45 70% 60%)',
                    background: 'transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(45 70% 55% / 0.6)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-4 py-2.5 rounded-full text-sm outline-none w-64"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid hsl(45 70% 55% / 0.25)',
                  color: '#f5f0e8',
                }}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'hsl(45 70% 55%)' }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div
                        className="group cursor-pointer rounded-xl overflow-hidden"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid hsl(45 70% 55% / 0.15)',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div className="relative overflow-hidden" style={{ height: '280px' }}>
                          <AppImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />
                          {product.tag && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: BTN_GOLD, color: '#1a0f08' }}>
                              {product.tag}
                            </span>
                          )}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <motion.button
                              onClick={e => handleWishlist(e, product.id)}
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(15,8,5,0.8)', backdropFilter: 'blur(8px)', border: '1px solid hsl(45 70% 55% / 0.3)' }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart
                                className="w-4 h-4"
                                style={isLiked(product.id) ? { fill: 'hsl(45 70% 55%)', color: 'hsl(45 70% 55%)' } : { color: 'hsl(45 70% 55%)' }}
                              />
                            </motion.button>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3.5 h-3.5" style={{ fill: 'hsl(38 80% 55%)', color: 'hsl(38 80% 55%)' }} />
                            <span className="text-xs font-medium" style={{ color: 'hsl(38 70% 60%)' }}>{product.rating?.toFixed(1) || '4.5'} ({product.reviews || 0})</span>
                          </div>
                          <h3 className="font-serif text-base font-semibold mb-1" style={{ color: '#f5f0e8' }}>{product.name}</h3>
                          <p className="text-xs mb-4" style={{ color: 'hsl(38 30% 55%)' }}>{product.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold" style={{ color: 'hsl(45 75% 58%)' }}>{formatPrice(product.price)}</span>
                            <motion.button
                              onClick={e => handleAddToCart(e, product)}
                              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                              style={{ background: BTN_GOLD, color: '#1a0f08' }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Add
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl font-serif mb-2" style={{ color: 'hsl(45 70% 55%)' }}>No products found</p>
              <p className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>Try a different category or search term</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0805' }}>
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'hsl(45 70% 55%)' }} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
