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
  Tag,
  Percent,
  AlertTriangle,
  Star,
  RotateCcw,
} from 'lucide-react';

import { formatPrice } from '@/data/products';
import AppImage from '@/components/ui/AppImage';
import InventorySheet from '@/components/admin/InventorySheet';
import { useToast } from '@/hooks/use-toast';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

type Tab = 'add' | 'inventory' | 'orders' | 'refunds' | 'sheet' | 'analytics' | 'users' | 'items' | 'offers' | 'promos' | 'reviews';


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
  const [adminReviews, setAdminReviews] = useState<any[]>([]);
  const [offers, setOffers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [refundRequests, setRefundRequests] = useState<any[]>([]);


  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: 'Sarees',
    stock: '',
    sizes: 'XS, S, M, L, XL',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [selectedUserHistory, setSelectedUserHistory] = useState<string | null>(null);


  useEffect(() => {
    if (activeTab === 'inventory' || activeTab === 'analytics' || activeTab === 'sheet' || activeTab === 'offers')
      fetchProducts();
    if (activeTab === 'orders' || activeTab === 'analytics') fetchOrders();
    if (activeTab === 'analytics' || activeTab === 'users') fetchUsers();
    if (activeTab === 'items') fetchOrderItems();
    if (activeTab === 'offers') fetchOffers();
    if (activeTab === 'promos') fetchPromoCodes();
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'refunds') fetchRefunds();
  }, [activeTab]);


  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products');
      toast({
        title: 'Fetch Error',
        description: 'Failed to load inventory from Google Sheets.',
        variant: 'destructive',
      });
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

  const handleEdit = (product: any) => {
    setIsEditMode(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      sizes: product.sizes || 'XS, S, M, L, XL',
    });
    setPreviewUrl(product.image);
    setActiveTab('add');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingId?: string) => {
    setStatusUpdating(orderId);
    try {
      const res = await fetch('/api/admin/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, trackingId }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status, trackingId: trackingId || o.trackingId } : o));
        toast({ title: 'Status Updated', description: `Order ${orderId} is now ${status}.` });
      }
    } catch (err) {
      toast({ title: 'Update Failed', variant: 'destructive' });
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleUpdateUserStatus = async (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked';
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/update-user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.email === email ? { ...u, status: newStatus } : u));
        toast({ title: 'User Updated', description: `User status changed to ${newStatus}.` });
      }
    } catch (err) {
      toast({ title: 'Update Failed', variant: 'destructive' });
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
      toast({
        title: 'Fetch Error',
        description: 'Failed to load orders from Google Sheets.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRefunds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/refunds');
      const data = await res.json();
      if (data.success) setRefundRequests(data.refunds);
    } catch (err) {
      console.error('Failed to fetch refunds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRefundStatus = async (refundId: string, orderId: string, status: string) => {
    const adminComment = window.prompt('Add a comment (optional):') || '';
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/refund/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refundId, orderId, status, adminComment }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Refund Status Updated', description: `Request ${refundId} is now ${status}.` });
        fetchRefunds();
        fetchOrders();
      }
    } catch (err) {
      toast({ title: 'Update Failed', variant: 'destructive' });
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
      toast({
        title: 'Fetch Error',
        description: 'Failed to load user data from Google Sheets.',
        variant: 'destructive',
      });
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
      const res = await fetch('/api/products');
      const data = await res.json();
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
        setProducts(prevProducts => prevProducts.map(p => {
          if (p.id === product.id) {
            return {
              ...p,
              tag: action === 'add' ? offerTag : null
            };
          }
          return p;
        }));

        toast({
          title: action === 'add' ? 'Offer Added' : 'Offer Removed',
          description: `${product.name} has been ${action === 'add' ? 'added to' : 'removed from'} offers.`,
        });
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

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/promo-codes');
      const data = await res.json();
      if (data.success) setPromoCodes(data.codes);
    } catch (err) {
      console.error('Failed to fetch promos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPromo = async (promo: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
      const data = await res.json();
      if (data.success) {
        fetchPromoCodes();
        toast({ title: 'Promo Created', description: `Code ${promo.code} is now active.` });
      } else {
        toast({ title: 'Failed', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create promo.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePromo = async (code: string) => {
    if (!window.confirm('Delete this promo code?')) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoCodes(promoCodes.filter(c => c.code !== code));
        toast({ title: 'Promo Deleted' });
      } else {
        toast({ title: 'Delete Failed', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews?admin=true');
      const data = await res.json();
      if (data.success) setAdminReviews(data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (productId: string, userName: string, status: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateReviewStatus',
          productId,
          userName,
          status
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Review ${status}` });
        fetchReviews();
      }
    } catch (err) {
      toast({ title: 'Update Failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpdate = async (category: string, change: number, type: 'percentage' | 'fixed') => {
    if (!window.confirm(`Apply ${change}${type === 'percentage' ? '%' : ' units'} price change to all items in ${category}?`)) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, change, type }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Bulk Update Success', description: `Updated ${data.updatedCount} products.` });
        fetchProducts();
      }
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' });
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

      if (!isEditMode && !file) {
        alert('Please select an image!');
        setIsSubmitting(false);
        return;
      }

      const bodyData = new FormData();
      if (isEditMode) bodyData.append('productId', formData.id);
      bodyData.append('name', formData.name);
      bodyData.append('description', formData.description);
      bodyData.append('price', formData.price);
      bodyData.append('category', formData.category);
      bodyData.append('stock', formData.stock);
      bodyData.append('sizes', formData.sizes);
      if (file) bodyData.append('image', file);

      const endpoint = isEditMode ? '/api/admin/update-product' : '/api/admin/add-product';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: bodyData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsEditMode(false);
          setFormData({
            id: '',
            name: '',
            description: '',
            price: '',
            category: 'Sarees',
            stock: '',
            sizes: 'XS, S, M, L, XL',
          });
          setPreviewUrl(null);
          if (isEditMode) fetchProducts();
        }, 2000);
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
      <div className="min-h-screen bg-zinc-950 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-white/5 bg-zinc-900/30 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto">
          <div className="p-8 border-b border-white/5">
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Prinsora</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mt-1">Management Console</p>
          </div>
          
          <nav className="flex-grow p-4 space-y-1">
            {[
              { id: 'analytics', icon: TrendingUp, label: 'Dashboard' },
              { id: 'inventory', icon: List, label: 'Products' },
              { id: 'add', icon: Plus, label: isEditMode ? 'Edit Product' : 'Add Product' },
              { id: 'sheet', icon: LayoutGrid, label: 'Master Sheet' },
              { id: 'orders', icon: ShoppingCart, label: 'Orders' },
              { id: 'refunds', icon: RotateCcw, label: 'Refunds' },
              { id: 'users', icon: Users, label: 'Customers' },
              { id: 'reviews', icon: Star, label: 'Reviews' },
              { id: 'promos', icon: Tag, label: 'Promotions' },
              { id: 'offers', icon: Percent, label: 'Offer Zone' },
              { id: 'items', icon: Package, label: 'Item Analysis' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  activeTab === tab.id
                    ? 'bg-accent text-primary shadow-[0_10px_20px_rgba(212,168,67,0.15)]'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider">System Live</p>
                  <p className="text-[9px] text-zinc-500">v2.4.0 • Production</p>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/1xJZYOwkt0JXDwlGpAJZRAQzTrJ4rSeCktGCN5TjLwd4/edit', '_blank')}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-zinc-300 font-bold uppercase transition-all"
              >
                Raw Data Sync
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow overflow-x-hidden pt-6 lg:pt-0">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden px-6 mb-8 flex justify-between items-center">
            <h1 className="text-xl font-serif font-bold text-white">Prinsora Admin</h1>
            <div className="flex gap-2 bg-zinc-900/80 p-1 rounded-lg border border-white/5 overflow-x-auto max-w-[200px] no-scrollbar">
               {/* Mobile icons-only nav could go here, but for now we'll stick to a dropdown or simple scroll */}
               {['analytics', 'inventory', 'orders'].map(id => (
                 <button 
                   key={id}
                   onClick={() => setActiveTab(id as Tab)}
                   className={`p-2 rounded-md ${activeTab === id ? 'bg-accent text-primary' : 'text-zinc-500'}`}
                 >
                   {id === 'analytics' && <TrendingUp className="w-4 h-4" />}
                   {id === 'inventory' && <List className="w-4 h-4" />}
                   {id === 'orders' && <ShoppingCart className="w-4 h-4" />}
                 </button>
               ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12">
            {/* Contextual Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-8 bg-accent/50" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                    {activeTab === 'add' ? 'Catalog Management' : 
                     activeTab === 'inventory' ? 'Stock Control' :
                     activeTab === 'orders' ? 'Sales & Fulfillment' :
                     activeTab === 'analytics' ? 'Performance Insights' : 'Administration'}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white capitalize leading-tight">
                  {activeTab.replace('-', ' ')}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end px-4 border-r border-white/10">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">Admin Role</p>
                  <p className="text-xs text-white font-medium">Super User</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-primary p-0.5 shadow-lg shadow-accent/10">
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </div>
            </header>


          <AnimatePresence mode="wait">
            {activeTab === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl"
              >
                <form onSubmit={handleSubmit} className="divide-y divide-white/5">
                  <div className="p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-accent" />
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-white">
                            {isEditMode ? 'Edit Product' : 'New Listing'}
                          </h3>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">
                              Product Name
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-zinc-700"
                              placeholder="e.g. Royal Golden Saree"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">
                                Price (₹)
                              </label>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-accent font-bold">₹</span>
                                <input
                                  type="number"
                                  required
                                  value={formData.price}
                                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                  className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                  placeholder="2499"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">
                                Initial Stock
                              </label>
                              <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                placeholder="50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">
                              Category
                            </label>
                            <div className="relative">
                              <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all appearance-none cursor-pointer"
                              >
                                <option>Sarees</option>
                                <option>Kurtis</option>
                                <option>Lehengas</option>
                                <option>Dresses</option>
                                <option>Rings</option>
                                <option>Accessories</option>
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-zinc-500 rotate-90" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">
                              Sizes
                            </label>
                            <input
                              type="text"
                              value={formData.sizes}
                              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                              className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                              placeholder="XS, S, M, L, XL"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">
                              Full Description
                            </label>
                            <textarea
                              required
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                              }
                              rows={6}
                              className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                              placeholder="Crafted from pure silk with intricate zari work..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-accent" />
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-white">Media Assets</h3>
                        </div>

                        <div className="relative group max-w-sm mx-auto w-full">
                          <input
                            type="file"
                            accept="image/*"
                            required={!previewUrl}
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div
                            className={`border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden relative aspect-[4/5] ${
                              previewUrl
                                ? 'border-accent bg-accent/5'
                                : 'border-white/10 bg-zinc-950 hover:border-accent/50 hover:bg-zinc-900/50'
                            }`}
                          >
                            {previewUrl ? (
                              <div className="absolute inset-0 w-full h-full p-2">
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                                  <AppImage
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
                                      <Upload className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-white font-bold text-xs uppercase tracking-widest">Replace Image</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center p-8 pointer-events-none">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                                  <ImageIcon className="w-10 h-10 text-zinc-600 group-hover:text-accent transition-colors" />
                                </div>
                                <p className="text-white font-serif text-lg mb-2">
                                  Drop your visual here
                                </p>
                                <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
                                  PNG, JPG or WEBP (Max 5MB). Professional photography recommended.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <RefreshCw className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-white font-bold mb-1 uppercase tracking-wider">Cloud Synchronization</p>
                              <p className="text-[10px] text-zinc-500 leading-relaxed">
                                Assets are automatically mirrored to <span className="text-accent">Google Drive</span>. 
                                Catalog metadata is pushed to the <span className="text-accent">Master Ledger</span>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12 bg-white/[0.02] flex items-center justify-between">
                    <p className="text-[10px] text-zinc-500 italic max-w-xs">
                      All product listings are subject to internal quality audit before appearing on the storefront.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting || success}
                      className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] text-primary transition-all shadow-2xl ${
                        success
                          ? 'bg-green-500 shadow-green-500/20'
                          : 'bg-accent shadow-accent/40 hover:shadow-accent/60'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Finalizing...
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Listing Published
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> {isEditMode ? 'Save Changes' : 'Publish to Catalog'}
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">Live Catalog</p>
                    <p className="text-sm text-zinc-500">Managing {products.length} active items across all categories.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const cat = window.prompt('Enter Category Name:');
                        const change = window.prompt('Enter Price Change (e.g. -10 for 10% discount):');
                        if (cat && change) handleBulkUpdate(cat, parseFloat(change), 'percentage');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:bg-white/10 transition-all"
                    >
                      <Percent className="w-3 h-3 text-accent" /> Bulk Edit
                    </button>
                    <button
                      onClick={fetchProducts}
                      className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all group"
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-accent transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
                      />
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse font-bold">Synchronizing Vault...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md group hover:border-accent/30 transition-all duration-500 flex flex-col"
                      >
                        <div className="h-64 relative overflow-hidden">
                          <AppImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-zinc-950/80 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter border border-white/10">
                              #{product.id}
                            </span>
                            <span className="bg-accent text-primary px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter shadow-lg shadow-accent/20">
                              {product.category}
                            </span>
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                          
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="flex flex-col">
                               <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-0.5">Value</p>
                               <p className="text-xl font-serif font-bold text-white leading-none">{formatPrice(product.price)}</p>
                            </div>
                            <div className="flex flex-col items-end">
                               <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-0.5">Inventory</p>
                               <p className={`text-sm font-bold leading-none ${product.stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                                 {product.stock} units
                               </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col gap-4 bg-white/[0.01]">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-accent transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-zinc-500 text-xs italic line-clamp-2 leading-relaxed">
                              "{product.description || 'No formal description provided.'}"
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-white/5">
                             <button 
                                onClick={() => handleEdit(product)}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all duration-300"
                              >
                                Configure
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 transition-all group/del duration-300"
                              >
                                <AlertTriangle className="w-4 h-4 group-hover/del:text-white" />
                              </button>
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">Order Stream</p>
                    <p className="text-sm text-zinc-500">Processing live transactions and fulfillment requests.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedUserHistory && (
                      <button 
                        onClick={() => setSelectedUserHistory(null)}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-[10px] font-bold uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                      >
                        Clear Filter: {selectedUserHistory}
                      </button>
                    )}
                    <button
                      onClick={fetchOrders}
                      className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all group"
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-accent transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
                      />
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse font-bold">Fetching Ledger...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.filter(o => !selectedUserHistory || o.email === selectedUserHistory).length === 0 ? (
                      <div className="text-center py-32 bg-zinc-900/20 rounded-[2.5rem] border-2 border-dashed border-white/5">
                        <ShoppingCart className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                        <h3 className="text-xl font-serif text-zinc-400 mb-2">No Transactions Found</h3>
                        <p className="text-xs text-zinc-600 uppercase tracking-widest">Awaiting first customer interaction</p>
                      </div>
                    ) : (
                      orders
                        .filter(o => !selectedUserHistory || o.email === selectedUserHistory)
                        .map((order) => (
                        <div
                          key={order.id}
                          className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl hover:border-accent/20 transition-all duration-500 group"
                        >
                          <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-10">
                            <div className="flex-grow space-y-8">
                              <div className="flex flex-wrap justify-between items-start gap-6">
                                <div>
                                  <div className="flex items-center gap-4 mb-3">
                                    <span className="text-2xl font-serif font-bold text-accent tracking-tighter">
                                      {order.id}
                                    </span>
                                    <span
                                      className={`text-[9px] uppercase font-bold px-3 py-1 rounded-full border ${
                                        order.status === 'Pending' || order.status === 'Return Requested'
                                          ? 'text-amber-400 border-amber-400/20 bg-amber-400/5'
                                          : order.status === 'Cancelled' || order.status === 'Return Rejected'
                                          ? 'text-red-400 border-red-400/20 bg-red-400/5'
                                          : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-zinc-500 text-xs">
                                    <LayoutGrid className="w-3 h-3" />
                                    <span>Placed on {order.date}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Invoice Value</p>
                                  <p className="text-3xl font-serif font-bold text-white tracking-tight">{formatPrice(order.total)}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] mb-4">Recipient Details</p>
                                  <div className="space-y-1">
                                    <p className="text-white font-serif text-lg">{order.customer}</p>
                                    <p className="text-sm text-zinc-400">{order.email}</p>
                                    <p className="text-sm text-zinc-400">{order.phone}</p>
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">Delivery Node</p>
                                      <p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-2">
                                        "{order.address}"
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] mb-4">Financial Log</p>
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 px-4 rounded-xl bg-zinc-950/50 border border-white/5">
                                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Settlement</span>
                                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">{order.payment || 'Verified'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 px-4 rounded-xl bg-zinc-950/50 border border-white/5">
                                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Currency</span>
                                      <span className="text-xs text-white font-bold uppercase tracking-widest">INR</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="w-full lg:w-72 flex flex-col gap-6 pt-6 lg:pt-0 lg:border-l lg:border-white/5 lg:pl-10">
                              <div>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-4">Fulfillment Action</p>
                                <div className="space-y-4">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Update Phase</label>
                                    <div className="relative">
                                      <select 
                                        value={order.status}
                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                        disabled={statusUpdating === order.id}
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer transition-all"
                                      >
                                        <option>Confirmed</option>
                                        <option>Processing</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                        <option>Return Requested</option>
                                        <option>Returned</option>
                                        <option>Refunded</option>
                                      </select>
                                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 rotate-90" />
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Logistics Ref</label>
                                    <input 
                                      type="text"
                                      placeholder="Tracking #"
                                      defaultValue={order.trackingId}
                                      onBlur={(e) => {
                                        if (e.target.value !== order.trackingId) {
                                          handleUpdateOrderStatus(order.id, order.status, e.target.value);
                                        }
                                      }}
                                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                    />
                                  </div>
                                  
                                  <div className="pt-4">
                                    <button 
                                      onClick={() => setActiveTab('items')}
                                      className="w-full py-3 rounded-xl bg-accent text-primary text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
                                    >
                                      Analyze Breakdown
                                    </button>
                                  </div>
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

            {activeTab === 'refunds' && (
              <motion.div
                key="refunds"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif text-white">Refund Requests</h2>
                  <button
                    onClick={fetchRefunds}
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
                    {refundRequests.length === 0 ? (
                      <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-white/10">
                        <RotateCcw className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">No refund requests found.</p>
                      </div>
                    ) : (
                      refundRequests.map((refund) => (
                        <div
                          key={refund.refundId}
                          className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg font-bold text-accent font-mono">
                                  {refund.refundId}
                                </span>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                  refund.status === 'Pending' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5' :
                                  refund.status === 'Rejected' ? 'text-red-400 border-red-400/30 bg-red-400/5' :
                                  'text-green-400 border-green-400/30 bg-green-400/5'
                                }`}>
                                  {refund.status}
                                </span>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-accent/30 text-accent bg-accent/5">
                                  {refund.type || 'Return'}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500">Order ID: <span className="text-white">{refund.orderId}</span> • {refund.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <select 
                                value={refund.status}
                                onChange={(e) => handleUpdateRefundStatus(refund.refundId, refund.orderId, e.target.value)}
                                className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                              >
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                                <option>Refunded</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2">Details</p>
                              <p className="text-sm text-white mb-1"><span className="text-zinc-500">User:</span> {refund.email}</p>
                              <p className="text-sm text-white mb-1"><span className="text-zinc-500">Reason:</span> {refund.reason}</p>
                              {refund.comment && (
                                <p className="text-sm text-zinc-400 italic mt-2 bg-white/5 p-3 rounded-lg">
                                  "{refund.comment}"
                                </p>
                              )}
                            </div>
                            {refund.image && (
                              <div>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-2">Proof Image</p>
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                                  <AppImage src={refund.image} alt="Proof" fill className="object-cover" />
                                </div>
                              </div>
                            )}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl"
              >
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Customer Directory</h2>
                    <p className="text-xs text-zinc-500 mt-1">Managing authenticated user records and access levels.</p>
                  </div>
                  <button
                    onClick={fetchUsers}
                    className="p-3 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        <th className="px-10 py-5 font-bold">Node Joined</th>
                        <th className="px-10 py-5 font-bold">Identity</th>
                        <th className="px-10 py-5 font-bold">Contact</th>
                        <th className="px-10 py-5 font-bold">Security Status</th>
                        <th className="px-10 py-5 font-bold text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u, i) => (
                        <tr
                          key={i}
                          className="text-sm text-zinc-300 hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="px-10 py-6 font-mono text-[10px] text-zinc-600 group-hover:text-zinc-400">{u.timestamp}</td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 text-accent font-bold text-[10px]">
                                {u.name.charAt(0)}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex flex-col">
                              <span className="text-zinc-300">{u.email}</span>
                              <span className="text-[10px] text-zinc-600">{u.phone}</span>
                            </div>
                          </td>
                           <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                              u.status === 'Blocked' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex justify-end gap-3">
                              <button 
                                onClick={() => {
                                  setSelectedUserHistory(u.email);
                                  setActiveTab('orders');
                                }}
                                className="px-4 py-2 rounded-xl bg-white/5 text-white text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:bg-white/10 transition-all"
                              >
                                History
                              </button>
                              <button 
                                onClick={() => handleUpdateUserStatus(u.email, u.status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                  u.status === 'Blocked'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                {u.status === 'Blocked' ? 'Restore' : 'Suspend'}
                              </button>
                            </div>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl"
              >
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Itemized Breakdown</h2>
                    <p className="text-xs text-zinc-500 mt-1">Detailed SKU analysis and granular transaction logging.</p>
                  </div>
                  <button
                    onClick={fetchOrderItems}
                    className="p-3 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-accent ${isLoading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        <th className="px-10 py-5 font-bold">Transaction ID</th>
                        <th className="px-10 py-5 font-bold">Asset Name</th>
                        <th className="px-10 py-5 font-bold">Spec</th>
                        <th className="px-10 py-5 font-bold">Quantity</th>
                        <th className="px-10 py-5 font-bold text-right">Settled Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orderItems.map((item, i) => (
                        <tr
                          key={i}
                          className="text-sm text-zinc-300 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-10 py-6 font-mono text-accent font-bold text-xs uppercase">
                            {item.orderId}
                          </td>
                          <td className="px-10 py-6 text-white font-serif text-lg">{item.productName}</td>
                          <td className="px-10 py-6">
                            <span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                              {item.size}
                            </span>
                          </td>
                          <td className="px-10 py-6 font-bold">{item.quantity} units</td>
                          <td className="px-10 py-6 text-right font-serif text-xl font-bold text-white">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'promos' && (
              <motion.div
                key="promos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-serif text-white mb-6">Create New Promo Code</h2>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const data = new FormData(form);
                      handleAddPromo({
                        code: data.get('code'),
                        type: data.get('type'),
                        value: parseFloat(data.get('value') as string),
                        expiry: data.get('expiry')
                      });
                      form.reset();
                    }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                  >
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-2">Code</label>
                      <input name="code" required placeholder="WELCOME10" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-2">Type</label>
                      <select name="type" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-2">Value</label>
                      <input name="value" type="number" required placeholder="10" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white" />
                    </div>
                    <button type="submit" className="bg-accent text-primary h-[42px] rounded-lg font-bold uppercase text-xs hover:scale-105 transition-all">
                      Create Code
                    </button>
                  </form>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-serif text-white">Active Promotions</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Discount</th>
                        <th className="px-6 py-4">Expiry</th>
                        <th className="px-6 py-4">Usages</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {promoCodes.map((c, i) => (
                        <tr key={i} className="text-sm text-zinc-300">
                          <td className="px-6 py-4 font-bold text-accent">{c.code}</td>
                          <td className="px-6 py-4">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                          <td className="px-6 py-4 text-xs">{c.expiry || 'No Limit'}</td>
                          <td className="px-6 py-4">{c.usage}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeletePromo(c.code)}
                              className="text-red-400 hover:text-red-300 font-bold uppercase text-[10px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-sm flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-white">Review Moderation</h2>
                    <p className="text-sm text-zinc-500">Approve or reject customer stories and photos.</p>
                  </div>
                  <button onClick={fetchReviews} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <RefreshCw className={`w-5 h-5 text-accent ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {adminReviews.map((rev, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 flex gap-6">
                      {rev.imageUrl && (
                        <div className="w-32 h-40 relative rounded-xl overflow-hidden flex-shrink-0">
                          <AppImage src={rev.imageUrl} alt="Review" fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-bold">{rev.userName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border ${
                              rev.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              rev.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                            }`}>
                              {rev.status}
                            </span>
                          </div>
                          <p className="text-xs text-accent mb-1 font-mono">{rev.productId}</p>
                          <p className="text-sm text-zinc-400 line-clamp-3 italic">"{rev.comment}"</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handleUpdateReviewStatus(rev.productId, rev.userName, 'Approved')}
                            className="flex-1 py-2 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase border border-green-500/20 hover:bg-green-500/20"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateReviewStatus(rev.productId, rev.userName, 'Rejected')}
                            className="flex-1 py-2 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase border border-red-500/20 hover:bg-red-500/20"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {adminReviews.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                      <p className="text-zinc-500 text-sm">No reviews found for moderation.</p>
                    </div>
                  )}
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
      </main>
    </div>
  </ProtectedRoute>
  );
}
