"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserProfile = {
  user_id: number;
  name: string;
  email: string;
  avatar?: string;
  tier?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Khởi tạo từ localStorage
    const savedUser = localStorage.getItem("inkwell_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Lỗi khi đọc dữ liệu đăng nhập:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem("inkwell_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("inkwell_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
