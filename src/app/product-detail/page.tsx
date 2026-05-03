'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/app/product-detail/components/ProductGallery';
import ProductInfo from '@/app/product-detail/components/ProductInfo';
import ProductReviews from '@/app/product-detail/components/ProductReviews';
import RelatedProducts from '@/app/product-detail/components/RelatedProducts';
import Icon from '@/components/ui/AppIcon';

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.products) {
          const found = data.products.find((p: any) => p.id.toString() === productId);
          setProduct(found);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <Icon name="ChevronRightIcon" size={10} />
          <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
          <Icon name="ChevronRightIcon" size={10} />
          <span className="text-foreground font-medium">{product?.name || 'Loading...'}</span>
        </nav>
      </div>

      {/* Main Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
            <a href="/shop" className="text-accent mt-4 inline-block hover:underline">Back to Shop</a>
          </div>
        )}
      </div>

      {/* Reviews */}
      <ProductReviews />

      {/* Related */}
      <RelatedProducts />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <React.Suspense fallback={<div className="pt-40 flex justify-center"><div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>}>
        <ProductDetailContent />
      </React.Suspense>
      <Footer />
    </main>
  );
}