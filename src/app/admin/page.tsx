'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Plus,
  Package,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  List,
  ShoppingCart,
  RefreshCw,
  ChevronRight,
  LayoutGrid,
  TrendingUp,
  Users,
} from 'lucide-react';
import { formatPrice } from '@/data/products';
import AppImage from '@/components/ui/AppImage';
import InventorySheet from '@/components/admin/InventorySheet';
import { useToast } from '@/hooks/use-toast';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

type Tab = 'add' | 'inventory' | 'orders' | 'sheet' | 'analytics' | 'users' | 'items' | 'offers';

export default function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [offers, setOffers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Sarees',
    stock: '',
    sizes: 'XS, S, M, L, XL',
  });

  useEffect(() => {
    if (activeTab === 'inventory' || activeTab === 'analytics' || activeTab === 'sheet' || activeTab === 'offers')
      fetchProducts();
    if (activeTab === 'orders' || activeTab === 'analytics') fetchOrders();
    if (activeTab === 'analytics' || activeTab === 'users') fetchUsers();
    if (activeTab === 'items') fetchOrderItems();
    if (activeTab === 'offers') fetchOffers();
  }, [activeTab]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete: ' + data.error);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/get-orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/get-users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/get-order-items');
      const data = await res.json();
      if (data.success) setOrderItems(data.items);
    } catch (err) {
      console.error('Failed to fetch order items');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      // Reusing products API which now returns merged data, but we need the raw offer map
      // Actually, let's just use the products list and look at their 'tag' property
      const res = await fetch('/api/products');
      const data = await res.json();
      // For the UI, we'll just check which products have a specific tag from the sheet
      // To be more precise, let's just fetch everything and we'll handle it in the view
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch offers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleOffer = async (product: any, currentTag: string | null) => {
    const isCurrentlyOffer = !!currentTag && (currentTag.includes('%') || currentTag.toLowerCase().includes('off'));
    const action = isCurrentlyOffer ? 'delete' : 'add';
    let offerTag = '';
    
    if (action === 'add') {
      offerTag = window.prompt('Enter offer tag (e.g. 50% OFF, LIMITED OFFER):', '50% OFF') || 'Offer';
      if (!offerTag) return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/toggle-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          offerTag,
          action
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: action === 'add' ? 'Offer Added' : 'Offer Removed',
          description: `${product.name} has been ${action === 'add' ? 'added to' : 'removed from'} offers.`,
        });
        fetchProducts(); // Refresh list
      } else {
        toast({
          title: 'Action Failed',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        alert('Please select an image!');
        setIsSubmitting(false);
        return;
      }

      const bodyData = new FormData();
      bodyData.append('name', formData.name);
      bodyData.append('description', formData.description);
      bodyData.append('price', formData.price);
      bodyData.append('category', formData.category);
      bodyData.append('stock', formData.stock);
      bodyData.append('sizes', formData.sizes);
      bodyData.append('image', file);

      const response = await fetch('/api/admin/add-product', {
        method: 'POST',
        body: bodyData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Sarees',
            stock: '',
            sizes: 'XS, S, M, L, XL',
          });
          setPreviewUrl(null);
        }, 3000);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-zinc-400">
                Control center for Prinsora luxury inventory and sales.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
              {[
                { id: 'add', icon: Plus, label: 'Add' },
                { id: 'inventory', icon: List, label: 'Inventory' },
                { id: 'sheet', icon: LayoutGrid, label: 'Sheet' },
                { id: 'orders', icon: ShoppingCart, label: 'Orders' },
                { id: 'items', icon: Package, label: 'Items' },
                { id: 'users', icon: Users, label: 'Users' },
                { id: 'analytics', icon: TrendingUp, label: 'Stats' },
                { id: 'offers', icon: TrendingUp, label: 'Offers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent text-primary shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-sm"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h2 className="text-xl font-serif font-semibold text-white flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-6 bg-accent rounded-full inline-block" />
                        Product Details
                      </h2>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                          Product Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                          placeholder="e.g. Royal Golden Saree"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                          Description
                        </label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={4}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                          placeholder="Describe the material, origin, and style..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                            placeholder="2499"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                            Initial Stock
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                            placeholder="50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all appearance-none"
                        >
                          <option>Sarees</option>
                          <option>Kurtis</option>
                          <option>Lehengas</option>
                          <option>Dresses</option>
                          <option>Rings</option>
                          <option>Accessories</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2 font-medium">
                          Available Sizes (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.sizes}
                          onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                          placeholder="e.g. S, M, L, XL"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-xl font-serif font-semibold text-white flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-6 bg-accent rounded-full inline-block" />
                        Product Image
                      </h2>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          required={!previewUrl}
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                          className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
                            previewUrl
                              ? 'border-accent/50 bg-accent/5'
                              : 'border-white/20 bg-zinc-950 hover:border-accent/40 hover:bg-zinc-900'
                          } aspect-[4/5] w-full max-w-sm mx-auto relative`}
                        >
                          {previewUrl ? (
                            <div className="absolute inset-0 w-full h-full">
                              <AppImage
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-medium flex items-center gap-2">
                                  <Upload className="w-4 h-4" /> Change Image
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-6 pointer-events-none">
                              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-accent transition-colors" />
                              </div>
                              <p className="text-white font-medium mb-1">
                                Click or drag image to upload
                              </p>
                              <p className="text-sm text-zinc-500">
                                High-res PNG, JPG or WEBP (max 5MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex gap-3">
                        <Upload className="w-5 h-5 text-accent flex-shrink-0" />
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Securely uploaded to <strong className="text-accent">Google Drive</strong>
                          . Metadata synchronized with{' '}
                          <strong className="text-accent">Google Sheets</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting || success}
                      className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary transition-all shadow-lg ${
                        success
                          ? 'bg-green-500 shadow-green-500/20'
                          : 'bg-accent shadow-accent/20 hover:shadow-accent/40'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle className="w-5 h-5" /> Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" /> Add Product to Catalog
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif text-white">Current Inventory</h2>
                  <button
                    onClick={fetchProducts}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`w-5 h-5 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-accent" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-accent/30 transition-all flex flex-col md:flex-row"
                      >
                        <div className="w-full md:w-64 h-48 relative flex-shrink-0">
                          <AppImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-accent text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                            ID: {product.id}
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                {product.avatar && (
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-accent/30 flex-shrink-0">
                                    <AppImage
                                      src={product.avatar}
                                      alt="Avatar"
                                      width={40}
                                      height={40}
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <h3 className="text-xl font-serif font-bold text-white">
                                  {product.name}
                                </h3>
                              </div>
                              <span className="bg-zinc-800 text-accent border border-accent/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {product.category}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-sm line-clamp-2 mb-4 italic">
                              "{product.description || 'No description provided.'}"
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                            <div className="flex gap-6">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                                  Price
                                </p>
                                <p className="text-accent font-bold text-lg">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                                  Stock
                                </p>
                                <p
                                  className={`font-bold text-lg ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}
                                >
                                  {product.stock} pcs
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700 transition-colors">
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'sheet' && (
              <motion.div
                key="sheet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-serif text-white">Master Inventory Sheet</h2>
                  <button
                    onClick={fetchProducts}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold border border-accent/20 hover:bg-accent/20 transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Sync with
                    Google Sheets
                  </button>
                </div>
                <InventorySheet products={products} onDelete={handleDelete} />
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif text-white">Customer Orders</h2>
                  <button
                    onClick={fetchOrders}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`w-5 h-5 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-accent" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-white/10">
                        <ShoppingCart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">No orders found in database.</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-all"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg font-bold text-accent font-mono">
                                  {order.id}
                                </span>
                                <span
                                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                    order.status === 'Pending'
                                      ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5'
                                      : 'text-green-400 border-green-400/30 bg-green-400/5'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-400">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                                Total Amount
                              </p>
                              <p className="text-2xl font-serif font-bold text-white">
                                {formatPrice(order.total)}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-3">
                                Customer Info
                              </p>
                              <p className="text-white font-medium">{order.customer}</p>
                              <p className="text-sm text-zinc-400">{order.email}</p>
                              <p className="text-sm text-zinc-400">{order.phone}</p>
                              <p className="text-sm text-zinc-400 mt-2 line-clamp-2 italic">
                                "{order.address}"
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-3">
                                Payment & Fulfillment
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-zinc-500">Method:</span>
                                  <span className="text-white font-medium">{order.payment}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-zinc-500">Logistics:</span>
                                  <span className="text-accent font-medium">Standard Shipping</span>
                                </div>
                                <div className="pt-2">
                                  <button className="w-full py-2 rounded bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider border border-accent/20 hover:bg-accent/20 transition-all">
                                    View Details in 'Items' Tab
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AnalyticsDashboard orders={orders} users={users} products={products} />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-serif text-white">Registered Users</h2>
                  <button
                    onClick={fetchUsers}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                        <th className="px-6 py-4 font-medium">Timestamp</th>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Phone</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u, i) => (
                        <tr
                          key={i}
                          className="text-sm text-zinc-300 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs">{u.timestamp}</td>
                          <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">{u.phone}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'items' && (
              <motion.div
                key="items"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-serif text-white">Individual Order Items</h2>
                  <button
                    onClick={fetchOrderItems}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                        <th className="px-6 py-4 font-medium">Order ID</th>
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">Size</th>
                        <th className="px-6 py-4 font-medium">Qty</th>
                        <th className="px-6 py-4 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orderItems.map((item, i) => (
                        <tr
                          key={i}
                          className="text-sm text-zinc-300 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-accent font-bold">
                            {item.orderId}
                          </td>
                          <td className="px-6 py-4 text-white font-medium">{item.productName}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs border border-white/5">
                              {item.size}
                            </span>
                          </td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4 text-accent font-bold">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'offers' && (
              <motion.div
                key="offers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-white">Offer Management</h2>
                    <p className="text-sm text-zinc-500">Add or remove products from the Offers section.</p>
                  </div>
                  <button
                    onClick={fetchProducts}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`w-5 h-5 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => {
                    const isOffer = p.tag && (p.tag.includes('%') || p.tag.toLowerCase().includes('off') || p.tag.toLowerCase().includes('sale'));
                    
                    return (
                      <div 
                        key={p.id}
                        className={`bg-zinc-900/50 border rounded-2xl p-4 flex gap-4 backdrop-blur-sm transition-all ${
                          isOffer ? 'border-accent shadow-[0_0_20px_rgba(212,168,67,0.1)]' : 'border-white/10'
                        }`}
                      >
                        <div className="w-20 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                          <AppImage src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div>
                            <h3 className="text-white font-medium text-sm line-clamp-1">{p.name}</h3>
                            <p className="text-zinc-500 text-xs mb-2">{p.category}</p>
                            {isOffer && (
                              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase">
                                {p.tag}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleToggleOffer(p, p.tag)}
                            disabled={isLoading}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                              isOffer 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                                : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                            }`}
                          >
                            {isOffer ? 'Remove Offer' : 'Add Offer'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Help / Info Section */}
          <div className="mt-12 bg-accent/5 border border-accent/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h4 className="text-white font-bold mb-1">Zero-Touch Automation</h4>
              <p className="text-zinc-400 text-sm">
                Your inventory is powered by <strong className="text-accent">Google Sheets</strong>.
                Any changes you make here are synchronized instantly. Images are securely hosted on
                your <strong className="text-accent">Google Drive</strong> to bypass standard
                storage limits.
              </p>
            </div>
            <button
              onClick={() =>
                window.open(
                  'https://docs.google.com/spreadsheets/d/1xJZYOwkt0JXDwlGpAJZRAQzTrJ4rSeCktGCN5TjLwd4/edit',
                  '_blank'
                )
              }
              className="px-4 py-2 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all whitespace-nowrap"
            >
              Open Sheet Directly
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
