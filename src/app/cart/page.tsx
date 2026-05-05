'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import AppImage from '@/components/ui/AppImage';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      localStorage.setItem('prinsora_redirect', '/checkout');
      toast({ title: 'Login Required', description: 'Please sign in to proceed to checkout.' });
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-2 font-semibold" style={{ color: 'hsl(45 70% 55%)' }}>Your Selection</p>
            <h1 className="text-4xl font-serif font-medium" style={{ background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Shopping Cart {count > 0 && <span>({count})</span>}
            </h1>
          </motion.div>

          {items.length === 0 ? (
            <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />
              <p className="text-xl font-serif mb-2" style={{ color: 'hsl(45 70% 55%)' }}>Your cart is empty</p>
              <p className="text-sm mb-8" style={{ color: 'hsl(38 30% 50%)' }}>Discover our curated collection</p>
              <Link href="/shop">
                <motion.button
                  className="px-8 py-3.5 rounded-full font-semibold text-sm"
                  style={{ background: BTN_GOLD, color: '#1a0f08' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Shop
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-10">
              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="flex gap-5 p-5 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid hsl(45 70% 55% / 0.15)',
                      }}
                    >
                      <Link href={`/product/${item.id}`}>
                        <div className="w-24 h-28 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative" style={{ border: '1px solid hsl(45 70% 55% / 0.2)' }}>
                          <AppImage src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-serif font-semibold mb-1" style={{ color: '#f5f0e8' }}>{item.name}</h3>
                            <p className="text-xs" style={{ color: 'hsl(38 30% 55%)' }}>Size: {item.size}</p>
                          </div>
                          <button onClick={() => removeItem(item.id, item.size)} className="p-2 rounded-lg transition-colors" style={{ color: 'hsl(0 60% 55%)' }}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 rounded-full" style={{ border: '1px solid hsl(45 70% 55% / 0.3)' }}>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors" style={{ color: 'hsl(45 70% 55%)' }}>
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center" style={{ color: '#f5f0e8' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors" style={{ color: 'hsl(45 70% 55%)' }}>
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-semibold" style={{ color: 'hsl(45 75% 58%)' }}>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div
                className="h-fit rounded-2xl p-7 sticky top-24"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid hsl(45 70% 55% / 0.2)',
                  boxShadow: '0 0 40px hsl(45 70% 55% / 0.06)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-serif text-xl font-medium mb-6" style={{ color: '#f5f0e8' }}>Order Summary</h2>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'hsl(38 30% 55%)' }}>Subtotal ({count} items)</span>
                    <span style={{ color: '#f5f0e8' }}>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'hsl(38 30% 55%)' }}>Shipping</span>
                    <span style={{ color: 'hsl(45 70% 55%)' }}>{total >= 25000 ? 'FREE' : formatPrice(499)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'hsl(38 30% 55%)' }}>Tax (18% GST)</span>
                    <span style={{ color: '#f5f0e8' }}>{formatPrice(Math.round(total * 0.18))}</span>
                  </div>
                </div>
                <div className="h-px mb-6" style={{ background: 'hsl(45 70% 55% / 0.2)' }} />
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold" style={{ color: '#f5f0e8' }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: 'hsl(45 75% 58%)' }}>
                    {formatPrice(total + (total >= 25000 ? 0 : 499) + Math.round(total * 0.18))}
                  </span>
                </div>
                <motion.button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm"
                  style={{ background: BTN_GOLD, color: '#1a0f08' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <Link href="/shop">
                  <p className="text-center text-xs mt-4 cursor-pointer" style={{ color: 'hsl(45 70% 55%)' }}>Continue Shopping</p>
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
