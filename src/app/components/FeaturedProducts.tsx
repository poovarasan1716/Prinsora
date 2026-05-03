'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Check, Loader2 } from 'lucide-react';

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-primary text-white',
  New: 'bg-accent text-primary',
  Sale: 'bg-red-500 text-white',
  Trending: 'bg-purple-600 text-white'
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

function ProductCard({ product }: { product: any }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = Math.round((product.originalPrice - product.price) / product.originalPrice * 100);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="product-card group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 transition-shadow duration-500"
    >
      {/* Image Container */}
      <Link href={`/product-detail?id=${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full"
        >
          <AppImage
            src={product.img}
            alt={product.alt}
            fill
            className="product-card-img object-cover object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
          />
        </motion.div>

        {/* Badge */}
        {product.badge &&
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide z-10 ${badgeColors[product.badge]}`}
          >
            {product.badge}
          </motion.span>
        }

        {/* Discount */}
        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[11px] font-bold bg-white/90 text-primary z-10">
          -{discount}%
        </span>

        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {e.preventDefault();setWishlisted(!wishlisted);}}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          
          <Icon
            name={wishlisted ? 'HeartIcon' : 'HeartIcon'}
            variant={wishlisted ? 'solid' : 'outline'}
            size={16}
            className={wishlisted ? 'text-red-500' : 'text-muted-foreground'} />
        </motion.button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 p-3 z-10">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            addedToCart ?
            'bg-green-500 text-white' : 'bg-primary text-white hover:bg-accent hover:text-primary'}`
            }>
            {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{product.category}</p>
        <Link href={`/product-detail?id=${product.id}`}>
          <h3 className="font-display font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) =>
            <svg
              key={star}
              className={`w-3 h-3 ${star <= Math.floor(product.rating) ? 'text-accent' : 'text-muted'}`}
              fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-primary font-display">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </motion.div>);
}

export default function FeaturedProducts() {
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          setRealProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Get unique categories from fetched products
  const categories = ['All', ...new Set(realProducts.map(p => p.category).filter(Boolean))];

  const filteredProducts = selectedCategory === 'All' 
    ? realProducts 
    : realProducts.filter(p => p.category === selectedCategory);

  return (
    <section className="py-16 lg:py-24 bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Curated for You</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Our Collection
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/shop"
              className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1.5 group"
            >
              View all products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Category Filter Bar */}
        {!isLoading && realProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-muted-foreground hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-zinc-500 italic">No products found in this category.</p>
          </div>
        ) : (
          <motion.div 
            key={selectedCategory} // Force re-animation on category change
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6"
          >
            {filteredProducts.map((product) =>
              <ProductCard key={product.id} product={product} />
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}