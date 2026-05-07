import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('prinsora_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('prinsora_cart', JSON.stringify(newItems));
  };

  const addItem = (product: Product, size = 'M') => {
    const existing = items.find((i) => i.id === product.id && i.size === size);
    if (existing) {
      save(
        items.map((i) =>
          i.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      save([
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          size,
        },
      ]);
    }
  };

  const removeItem = (id: string, size: string) =>
    save(items.filter((i) => !(i.id === id && i.size === size)));

  const updateQuantity = (id: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id, size);
      return;
    }
    save(items.map((i) => (i.id === id && i.size === size ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => save([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
