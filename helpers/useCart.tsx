import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Product, CartItem, calculateSubtotal, calculateTax, SHIPPING_COST } from './priceCalculations';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // For this use case, items are unique and can't be added more than once.
        // If quantity was a factor, we would increment it here.
        return prevItems;
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((productId: string) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const shipping = useMemo(() => (items.length > 0 ? SHIPPING_COST : 0), [items]);
  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);
  const itemCount = useMemo(() => items.length, [items]);

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};