"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  book_id: number;
  title: string;
  author: string;
  image_url: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (book: any, quantity?: number) => void;
  removeFromCart: (book_id: number) => void;
  updateQuantity: (book_id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("inkwell_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("inkwell_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (book: any, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.book_id === book.book_id);
      if (existing) {
        return prev.map((item) =>
          item.book_id === book.book_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Assuming books don't have price in DB yet, generate a random mock price between 100k - 300k
      const price = book.price || Math.floor(Math.random() * (260 - 80) + 80) * 1000;
      return [...prev, { 
        book_id: book.book_id, 
        title: book.title, 
        author: book.author, 
        image_url: book.image_url, 
        price, 
        quantity 
      }];
    });
  };

  const removeFromCart = (book_id: number) => {
    setItems((prev) => prev.filter((item) => item.book_id !== book_id));
  };

  const updateQuantity = (book_id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(book_id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.book_id === book_id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
