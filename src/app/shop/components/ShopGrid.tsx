'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-primary text-white',
  New: 'bg-accent text-primary',
  Sale: 'bg-red-500 text-white',
  Trending: 'bg-purple-600 text-white',
  Premium: 'bg-yellow-700 text-white'
};

export default function ShopGrid() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState('Newest');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          setAllProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch shop products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleWishlist = (id: number) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleAddToCart = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart((prev) => [...prev, id]);
    setTimeout(() => setAddedToCart((prev) => prev.filter((x) => x !== id)), 2000);
  };

  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price;
    if (sort === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{sortedProducts.length}</span> products
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent text-foreground">
            
            {sortOptions.map((o) =>
            <option key={o}>{o}</option>
            )}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedProducts.map((product) => {
          const discount = Math.round((product.originalPrice - product.price) / product.originalPrice * 100);
          const inCart = addedToCart.includes(product.id);
          const inWishlist = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              className="product-card group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1">
              
              <Link href={`/product-detail?id=${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
                <AppImage
                  src={product.img}
                  alt={product.alt}
                  fill
                  className="product-card-img object-cover object-top"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                
                {product.badge &&
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold z-10 ${badgeColors[product.badge]}`}>
                    {product.badge}
                  </span>
                }
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-primary z-10">
                  -{discount}%
                </span>
                <button
                  onClick={(e) => {e.preventDefault();toggleWishlist(product.id);}}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                  
                  <Icon
                    name="HeartIcon"
                    variant={inWishlist ? 'solid' : 'outline'}
                    size={14}
                    className={inWishlist ? 'text-red-500' : 'text-muted-foreground'} />
                  
                </button>
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2 z-10">
                  <button
                    onClick={(e) => handleAddToCart(product.id, e)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    inCart ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-accent hover:text-primary'}`
                    }>
                    
                    {inCart ? '✓ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </Link>
              <div className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{product.category}</p>
                <Link href={`/product-detail?id=${product.id}`}>
                  <h3 className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-primary font-display">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>);

        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {[1, 2, 3, 4, 5].map((page) =>
        <button
          key={page}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
          page === 1 ?
          'bg-primary text-white' : 'bg-white border border-border text-foreground hover:border-accent hover:text-accent'}`
          }>
          
            {page}
          </button>
        )}
        <button className="w-9 h-9 rounded-xl text-sm font-medium bg-white border border-border text-foreground hover:border-accent hover:text-accent transition-all flex items-center justify-center">
          <Icon name="ChevronRightIcon" size={16} />
        </button>
      </div>
    </div>);

}