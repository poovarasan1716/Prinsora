'use client';

import { motion } from 'framer-motion';
import { User as UserIcon, Heart, ShoppingBag, LogOut, Package, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import AppImage from '@/components/ui/AppImage';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { products, formatPrice } from '@/data/products';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

const mockOrders = [
  { id: 'PRN-2601', date: 'Apr 28, 2026', total: 45000, status: 'Delivered', items: ['Crimson Royal Saree'] },
  { id: 'PRN-2587', date: 'Apr 12, 2026', total: 85500, status: 'In Transit', items: ['Emerald Zari Lehenga'] },
  { id: 'PRN-2543', date: 'Mar 30, 2026', total: 29000, status: 'Delivered', items: ['Silk Fusion Kurta Set'] },
];

const statusColor: Record<string, string> = {
  'Delivered': '#4ade80',
  'In Transit': 'hsl(45 80% 60%)',
  'Processing': '#60a5fa',
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { items: wishlistIds } = useWishlist();
  const { count } = useCart();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0805' }}>
        <div className="text-center">
          <UserIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />
          <p className="text-xl font-serif mb-2" style={{ color: 'hsl(45 70% 55%)' }}>Please sign in</p>
          <p className="text-sm mb-8" style={{ color: 'hsl(38 30% 50%)' }}>Access your profile and orders</p>
          <Link href="/login">
            <motion.button className="px-8 py-3.5 rounded-full font-semibold text-sm" style={{ background: BTN_GOLD, color: '#1a0f08' }} whileHover={{ scale: 1.02 }}>
              Sign In
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-serif font-bold flex-shrink-0" style={{ background: BTN_GOLD, color: '#1a0f08' }}>
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-serif font-medium mb-1" style={{ background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {user.name}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'hsl(38 30% 55%)' }}>{user.email}</p>
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Package, label: 'Orders', value: mockOrders.length },
                  { icon: Heart, label: 'Wishlist', value: wishlistIds.length },
                  { icon: ShoppingBag, label: 'Cart', value: count },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: 'hsl(45 70% 55%)' }} />
                    <span className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>{value}</span>
                    <span className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin">
                <motion.button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium flex-shrink-0"
                  style={{ background: 'rgba(212, 168, 67, 0.1)', border: '1px solid hsl(45 70% 55% / 0.4)', color: 'hsl(45 70% 55%)' }}
                  whileHover={{ background: 'rgba(212, 168, 67, 0.15)', scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </motion.button>
              </Link>
              <motion.button
                onClick={() => { logout(); router.push('/'); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium flex-shrink-0"
                style={{ border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}
                whileHover={{ background: 'rgba(220,38,38,0.08)', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Orders */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-serif text-2xl font-medium mb-6" style={{ color: 'hsl(45 75% 58%)' }}>My Orders</h2>
              <div className="flex flex-col gap-4">
                {mockOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.15)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold font-mono" style={{ color: 'hsl(45 70% 55%)' }}>{order.id}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status], border: `1px solid ${statusColor[order.status]}40` }}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#f5f0e8' }}>{order.items.join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'hsl(38 30% 50%)' }}>{order.date}</span>
                      <span className="text-sm font-semibold" style={{ color: 'hsl(45 75% 58%)' }}>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Wishlist */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-serif text-2xl font-medium mb-6" style={{ color: 'hsl(45 75% 58%)' }}>My Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="p-8 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.15)' }}>
                  <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />
                  <p className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>Your wishlist is empty</p>
                  <Link href="/shop">
                    <button className="mt-4 text-xs underline underline-offset-4" style={{ color: 'hsl(45 70% 55%)' }}>Explore Shop</button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {wishlistProducts.map(product => (
                    <Link href={`/product/${product.id}`} key={product.id}>
                      <div className="flex gap-4 p-4 rounded-xl cursor-pointer transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.15)' }}>
                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <AppImage src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-serif font-medium mb-1" style={{ color: '#f5f0e8' }}>{product.name}</h3>
                          <p className="text-sm" style={{ color: 'hsl(45 75% 58%)' }}>{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
