"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

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

function getStorageKey(userId?: number | null) {
  if (userId) return `inkwell_cart_user_${userId}`;
  return "inkwell_cart_guest";
}

function loadCartFromStorage(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    // Tương thích ngược với khóa inkwell_cart cũ
    if (key === "inkwell_cart_guest") {
      const legacy = localStorage.getItem("inkwell_cart");
      if (legacy) return JSON.parse(legacy);
    }
  } catch (e) {
    console.error("Failed to parse cart data from", key, e);
  }
  return [];
}

function saveCartToStorage(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
    if (key === "inkwell_cart_guest") {
      localStorage.setItem("inkwell_cart", JSON.stringify(items));
    }
  } catch (e) {
    console.error("Failed to save cart to", key, e);
  }
}

/**
 * Hợp nhất (Merge) giỏ hàng của khách vãng lai vào giỏ hàng tài khoản đăng nhập.
 * Nếu sách đã có trong tài khoản, cộng dồn số lượng.
 * Nếu sách mới, thêm vào danh sách.
 */
function mergeCartItems(target: CartItem[], incoming: CartItem[]): CartItem[] {
  const result = [...target];
  for (const item of incoming) {
    const idx = result.findIndex((i) => i.book_id === item.book_id);
    if (idx > -1) {
      result[idx] = {
        ...result[idx],
        quantity: result[idx].quantity + item.quantity,
      };
    } else {
      result.push(item);
    }
  }
  return result;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const prevUserIdRef = useRef<number | null | undefined>(undefined);

  // Đồng bộ giỏ hàng khi trạng thái đăng nhập thay đổi (Đăng nhập, Đăng xuất, Chuyển đổi user)
  useEffect(() => {
    const currentUserId = user?.user_id || null;
    const prevUserId = prevUserIdRef.current;

    // Khởi tạo lần đầu khi component mount
    if (prevUserId === undefined) {
      prevUserIdRef.current = currentUserId;
      const key = getStorageKey(currentUserId);
      const initialItems = loadCartFromStorage(key);
      setItems(initialItems);
      setIsLoaded(true);
      return;
    }

    // Trường hợp 1: Khách vãng lai -> Đăng nhập tài khoản
    // (Bảo lưu toàn bộ sách đã thêm trước đó sang tài khoản mới đăng nhập)
    if (!prevUserId && currentUserId) {
      const guestItems = loadCartFromStorage("inkwell_cart_guest");
      const userKey = getStorageKey(currentUserId);
      const existingUserItems = loadCartFromStorage(userKey);

      if (guestItems.length > 0) {
        // Hợp nhất giỏ hàng khách vào giỏ hàng tài khoản
        const merged = mergeCartItems(existingUserItems, guestItems);
        saveCartToStorage(userKey, merged);
        // Dọn sạch giỏ tạm của khách
        saveCartToStorage("inkwell_cart_guest", []);
        localStorage.removeItem("inkwell_cart");
        setItems(merged);
      } else {
        setItems(existingUserItems);
      }
    }
    // Trường hợp 2: Đăng xuất -> Trở về khách vãng lai
    else if (prevUserId && !currentUserId) {
      // Giỏ của tài khoản trước đó đã được tự động lưu trong useEffect([items])
      // Nạp lại giỏ hàng riêng của khách vãng lai
      const guestItems = loadCartFromStorage("inkwell_cart_guest");
      setItems(guestItems);
    }
    // Trường hợp 3: Chuyển đổi giữa các tài khoản mẫu (User A -> User B)
    else if (prevUserId !== currentUserId) {
      const newKey = getStorageKey(currentUserId);
      const userItems = loadCartFromStorage(newKey);
      setItems(userItems);
    }

    prevUserIdRef.current = currentUserId;
  }, [user]);

  // Tự động lưu giỏ hàng khi danh sách sản phẩm thay đổi
  useEffect(() => {
    if (!isLoaded) return;
    const currentKey = getStorageKey(user?.user_id);
    saveCartToStorage(currentKey, items);
  }, [items, isLoaded, user]);

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
      const price = book.price || Math.floor(Math.random() * (260 - 80) + 80) * 1000;
      return [
        ...prev,
        {
          book_id: book.book_id,
          title: book.title,
          author: book.author || book.authors || "The Inkwell",
          image_url: book.image_url || book.cover_image || "/books/default.jpg",
          price,
          quantity,
        },
      ];
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
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
