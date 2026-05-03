'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCart: CartItem[] = [];
const initialWishlist: WishlistItem[] = [];


export function CartProvider({ children }: {children: ReactNode;}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(initialWishlist);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
        i.id === item.id && i.size === item.size ?
        { ...i, quantity: i.quantity + item.quantity } :
        i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
    prev.map((i) => i.id === id && i.size === size ? { ...i, quantity } : i)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWishlist = useCallback(
    (id: string) => wishlistItems.some((i) => i.id === id),
    [wishlistItems]
  );

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartCount,
        wishlistCount,
        cartTotal
      }}>
      
      {children}
    </CartContext.Provider>);

}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}