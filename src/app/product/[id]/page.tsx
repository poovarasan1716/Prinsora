'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Loader2,
  Camera,
  X,
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import AppImage from '@/components/ui/AppImage';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
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

  // Review states
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', image: '' as any });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  useEffect(() => {
    if (!id) return;

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const found = data.products?.find(
          (p: any) => String(p.id) === String(id),
        );
        if (found) {
          setProduct(found);
          // Set default size if available
          if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch product details:', err))
      .finally(() => setIsLoading(false));

    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${id}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };


  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f0805' }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f0805' }}
      >
        <div className="text-center">
          <p className="text-2xl font-serif mb-4" style={{ color: 'hsl(45 70% 55%)' }}>
            Product not found
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-2 rounded-full text-sm"
            style={{ background: BTN_GOLD, color: '#1a0f08' }}
          >
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
    await new Promise((r) => setTimeout(r, 600));
    addItem(product, selectedSize);
    setAddingToCart(false);
    toast({
      title: '✦ Added to Cart',
      description: `${product.name} (Size: ${selectedSize}) added to cart.`,
    });
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Login Required', description: 'Please login to write a review' });
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      let imageData = '';
      let fileName = '';
      if (newReview.image) {
        imageData = newReview.image.split(',')[1];
        fileName = `review_${user.id}_${Date.now()}.png`;
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment,
          imageData,
          fileName,
          mimeType: 'image/png'
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: '✦ Review Submitted', description: 'Your review is pending moderation.' });
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: '', image: '' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview({ ...newReview, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
              style={{
                height: '560px',
                border: '1px solid hsl(45 70% 55% / 0.2)',
                boxShadow: '0 0 60px hsl(45 70% 55% / 0.08)',
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <AppImage src={product.image} alt={product.name} fill className="object-cover" />
              {product.tag && (
                <span
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: BTN_GOLD, color: '#1a0f08' }}
                >
                  {product.tag}
                </span>
              )}
              <motion.button
                onClick={() => {
                  toggle(product.id);
                  toast({
                    title: liked ? 'Removed from Wishlist' : '♡ Saved to Wishlist',
                    description: '',
                  });
                }}
                className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(15,8,5,0.85)',
                  border: '1px solid hsl(45 70% 55% / 0.4)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className="w-5 h-5"
                  style={
                    liked
                      ? { fill: 'hsl(45 70% 55%)', color: 'hsl(45 70% 55%)' }
                      : { color: 'hsl(45 70% 55%)' }
                  }
                />
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
                <p
                  className="text-xs tracking-[0.3em] uppercase font-semibold mb-2"
                  style={{ color: 'hsl(45 70% 55%)' }}
                >
                  {product.category}
                </p>
                <h1
                  className="text-4xl font-serif font-medium mb-3"
                  style={{
                    background: GOLD,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        style={{
                          fill: i < Math.floor(product.rating) ? 'hsl(38 80% 55%)' : 'transparent',
                          color: 'hsl(38 80% 55%)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: 'hsl(38 60% 55%)' }}>
                    {product.rating} · {product.reviews} reviews
                  </span>
                </div>
              </div>

              <div className="h-px" style={{ background: 'hsl(45 70% 55% / 0.2)' }} />

              <div className="flex flex-col gap-1">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm line-through opacity-50" style={{ color: 'hsl(45 75% 58%)' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold" style={{ color: 'hsl(45 75% 58%)' }}>
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm" style={{ color: 'hsl(38 30% 50%)' }}>
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3" style={{ color: 'hsl(38 60% 65%)' }}>
                  Select Size
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200"
                      style={
                        selectedSize === size
                          ? {
                              background: BTN_GOLD,
                              color: '#1a0f08',
                              border: '1px solid transparent',
                            }
                          : {
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid hsl(45 70% 55% / 0.3)',
                              color: '#f5f0e8',
                            }
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <p
                className="text-sm leading-relaxed font-light"
                style={{ color: 'hsl(38 30% 65%)' }}
              >
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
                  style={{
                    border: '1.5px solid hsl(45 70% 55%)',
                    color: 'hsl(45 70% 60%)',
                    background: 'transparent',
                  }}
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
                  <div
                    key={label}
                    className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid hsl(45 70% 55% / 0.12)',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'hsl(45 70% 55%)' }} />
                    <p className="text-xs font-semibold" style={{ color: '#f5f0e8' }}>
                      {label}
                    </p>
                    <p className="text-[10px]" style={{ color: 'hsl(38 30% 50%)' }}>
                      {sub}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <div className="mt-24 pt-16 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Customer Experiences</h2>
                <p className="text-zinc-500 text-sm italic">Sharing the elegance of Prinsora from across the world.</p>
              </div>
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-accent/30 text-accent hover:bg-accent/10 transition-all"
              >
                {showReviewForm ? 'Cancel Review' : 'Share Your Experience'}
              </button>
            </div>

            <AnimatePresence>
              {showReviewForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-16 overflow-hidden"
                >
                  <form 
                    onSubmit={handleSubmitReview}
                    className="max-w-2xl bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                  >
                    <div className="grid gap-6">
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((star) => (
                          <button 
                            key={star}
                            type="button"
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className="transition-transform hover:scale-110"
                          >
                            <Star 
                              className="w-6 h-6" 
                              style={{ 
                                fill: star <= newReview.rating ? 'hsl(45 80% 55%)' : 'transparent',
                                color: 'hsl(45 80% 55%)'
                              }} 
                            />
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Your Experience</label>
                        <textarea 
                          required
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          placeholder="Tell us about the fit, fabric, and how you felt..."
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/50 h-32 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Share a Photo (Optional)</label>
                        {!newReview.image ? (
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <Camera className="w-8 h-8 text-zinc-600 mb-2" />
                            <span className="text-xs text-zinc-500">Click to upload or drag & drop</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        ) : (
                          <div className="relative w-40 h-40 rounded-xl overflow-hidden group">
                            <img src={newReview.image} alt="Review" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setNewReview({...newReview, image: ''})}
                              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full py-4 rounded-xl bg-accent text-primary font-bold uppercase tracking-widest text-xs disabled:opacity-50 transition-transform hover:scale-[1.02]"
                      >
                        {isSubmittingReview ? 'Submitting Your Story...' : 'Post Review'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((rev, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-serif font-medium">{rev.userName}</p>
                      <p className="text-[10px] text-zinc-500">{rev.timestamp}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star 
                          key={j}
                          className="w-3 h-3"
                          style={{ 
                            fill: j < rev.rating ? 'hsl(45 80% 55%)' : 'transparent',
                            color: 'hsl(45 80% 55%)'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-4 leading-relaxed italic">"{rev.comment}"</p>
                  {rev.imageUrl && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mt-4">
                      <AppImage src={rev.imageUrl} alt="Review" fill className="object-cover" />
                    </div>
                  )}
                </motion.div>
              ))}
              {reviews.length === 0 && !showReviewForm && (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-zinc-500 text-sm">Be the first to share your Prinsora story.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
