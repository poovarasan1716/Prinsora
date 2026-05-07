import { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  items: string[];
  toggle: (id: string) => void;
  isLiked: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('prinsora_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggle = (id: string) => {
    const next = items.includes(id) ? items.filter((i) => i !== id) : [...items, id];
    setItems(next);
    localStorage.setItem('prinsora_wishlist', JSON.stringify(next));
  };

  const isLiked = (id: string) => items.includes(id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isLiked, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
