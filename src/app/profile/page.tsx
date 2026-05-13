'use client';

import { motion } from 'framer-motion';
import { User as UserIcon, Heart, ShoppingBag, LogOut, Package, Settings, RotateCcw, Loader2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import AppImage from '@/components/ui/AppImage';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { products, formatPrice } from '@/data/products';
import ReturnModal from '@/components/profile/ReturnModal';
import OrderTracking from '@/components/profile/OrderTracking';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

const statusColor: Record<string, string> = {
  Delivered: '#4ade80',
  'In Transit': 'hsl(45 80% 60%)',
  Processing: '#60a5fa',
  Confirmed: '#a78bfa',
  'Return Requested': '#fbbf24',
  Refunded: '#94a3b8',
  'Return Rejected': '#f87171',
};

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: any[];
  email?: string;
  trackingId?: string;
  payment?: string;
  image?: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { items: wishlistIds } = useWishlist();
  const { count } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders();
    }
  }, [user?.email]);

  const fetchUserOrders = async () => {
    try {
      setFetchingOrders(true);
      const res = await fetch(`/api/user/orders?email=${user?.email}`);
      const data = await res.json();
      if (data.success) {
        const ordersWithImages = data.orders.map((o: any) => {
          const firstItemName = Array.isArray(o.items) && o.items.length > 0 
            ? (typeof o.items[0] === 'string' ? o.items[0] : o.items[0].name).toString().trim()
            : '';
          const product = products.find(p => p.name.trim() === firstItemName);
          return { ...o, image: product?.image || '' };
        });
        setOrders(ordersWithImages);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setFetchingOrders(false);
    }
  };

  const isReturnEligible = (orderDate: string) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const diffDays = (currentTime - orderTime) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0805' }}>
        <div className="text-center">
          <UserIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />
          <p className="text-xl font-serif mb-2" style={{ color: 'hsl(45 70% 55%)' }}>Please sign in</p>
          <p className="text-sm mb-8" style={{ color: 'hsl(38 30% 50%)' }}>Access your profile and orders</p>
          <Link href="/login">
            <motion.button
              className="px-8 py-3.5 rounded-full font-semibold text-sm"
              style={{ background: BTN_GOLD, color: '#1a0f08' }}
              whileHover={{ scale: 1.02 }}
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const initials = (user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 p-8 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid hsl(45 70% 55% / 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-serif font-bold flex-shrink-0"
              style={{ background: BTN_GOLD, color: '#1a0f08' }}
            >
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1
                className="text-3xl font-serif font-medium mb-1"
                style={{
                  background: GOLD,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {user.name}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'hsl(38 30% 55%)' }}>
                {user.email}
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Package, label: 'Orders', value: orders.length },
                  { icon: Heart, label: 'Wishlist', value: wishlistIds.length },
                  { icon: ShoppingBag, label: 'Cart', value: count },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: 'hsl(45 70% 55%)' }} />
                    <span className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>
                      {value}
                    </span>
                    <span className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin">
                <motion.button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium flex-shrink-0"
                  style={{
                    background: 'rgba(212, 168, 67, 0.1)',
                    border: '1px solid hsl(45 70% 55% / 0.4)',
                    color: 'hsl(45 70% 55%)',
                  }}
                  whileHover={{ background: 'rgba(212, 168, 67, 0.15)', scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </motion.button>
              </Link>
              <motion.button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
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
            {/* Orders Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-medium" style={{ color: 'hsl(45 75% 58%)' }}>My Orders</h2>
                {fetchingOrders && <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'hsl(45 70% 55%)' }} />}
              </div>
              
              <div className="flex flex-col gap-4">
                {orders.length === 0 && !fetchingOrders ? (
                  <div className="p-8 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.15)' }}>
                    <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />
                    <p className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>No orders found</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-xl group relative cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.15)' }}
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Product Photo */}
                        <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/5">
                          {order.image ? (
                            <AppImage src={order.image} alt="Product" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-zinc-800" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold font-mono" style={{ color: 'hsl(45 70% 55%)' }}>{order.id}</span>
                              {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-accent transition-colors" />}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/10">{order.payment}</span>
                              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold" style={{ background: `${statusColor[order.status] || '#94a3b8'}20`, color: statusColor[order.status] || '#94a3b8', border: `1px solid ${statusColor[order.status] || '#94a3b8'}40` }}>{order.status}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-white truncate">{Array.isArray(order.items) && order.items.length > 0 ? (typeof order.items[0] === 'string' ? order.items[0] : order.items[0].name) : 'Order Details'}</p>
                            <p className="text-xs text-zinc-500">{order.date} • {Array.isArray(order.items) ? order.items.length : 0} {order.items.length === 1 ? 'item' : 'items'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Return/Refund Button */}
                      {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'shipped') && (
                        <div className="flex items-center gap-3 mt-4">
                          {isReturnEligible(order.date) ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setIsReturnModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors border border-white/10"
                            >
                              <RotateCcw className="w-3 h-3" /> Request Return/Refund
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/30 cursor-help" title="Return window (7 days) expired">
                              <Calendar className="w-3 h-3" /> Window Expired
                            </span>
                          )}
                        </div>
                      )}

                      {/* Expansion Tracking Area */}
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-white/5 space-y-6"
                        >
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-bold">Items In This Order</p>
                            <div className="space-y-4">
                              {Array.isArray(order.items) && order.items.map((item: any, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="text-white/80">{typeof item === 'string' ? item : item.name} {typeof item !== 'string' && <span className="text-zinc-500 ml-2">x{item.quantity}</span>}</span>
                                  <span className="font-mono text-zinc-400">{typeof item !== 'string' ? formatPrice(item.total) : ''}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Shipment Progress</p>
                            <OrderTracking status={order.status} date={order.date} />
                          </div>
                          {order.trackingId && (
                            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                <p className="text-[10px] uppercase tracking-widest text-accent font-bold">Carrier Tracking: {order.trackingId}</p>
                              </div>
                              <a href={`https://www.17track.net/en/track?nums=${order.trackingId}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[9px] uppercase font-bold text-white/60 hover:text-accent underline underline-offset-2 transition-colors">Track Externally</a>
                            </div>
                          )}
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between mt-6 pt-3 border-t border-white/5">
                        <span className="text-xs" style={{ color: 'hsl(38 30% 50%)' }}>{order.date}</span>
                        <span className="text-sm font-semibold" style={{ color: 'hsl(45 75% 58%)' }}>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Wishlist Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl font-medium mb-6" style={{ color: 'hsl(45 75% 58%)' }}>My Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="p-8 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(45 70% 55% / 0.15)' }}>
                  <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(45 70% 55% / 0.4)' }} />
                  <p className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>Your wishlist is empty</p>
                  <Link href="/shop"><button className="mt-4 text-xs underline underline-offset-4" style={{ color: 'hsl(45 70% 55%)' }}>Explore Shop</button></Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {wishlistProducts.map((product) => (
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

      {selectedOrder && (
        <ReturnModal
          order={selectedOrder}
          isOpen={isReturnModalOpen}
          onClose={() => {
            setIsReturnModalOpen(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => fetchUserOrders()}
        />
      )}
      <Footer />
    </div>
  );
}
