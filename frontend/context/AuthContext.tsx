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
        let parsed: UserProfile = JSON.parse(savedUser);
        let hasModified = false;

        // 1. Kiểm tra đối chiếu với danh sách tài khoản đã đăng ký (inkwell_registered_accounts)
        try {
          const registeredRaw = localStorage.getItem("inkwell_registered_accounts");
          if (registeredRaw && parsed.email) {
            const list = JSON.parse(registeredRaw);
            const found = list.find((a: any) => a.email.toLowerCase() === parsed.email.toLowerCase());
            if (found && found.name && found.name !== parsed.name) {
              parsed = {
                ...parsed,
                name: found.name,
                user_id: found.user_id || parsed.user_id,
              };
              hasModified = true;
            }
          }
        } catch {}

        // 2. Tự động khắc phục (Auto-heal) nếu session cũ bị gán nhầm tên mặc định "Độc giả The Inkwell" hoặc ID #35 của Minh Anh
        if (parsed.email && !parsed.email.toLowerCase().includes("@theinkwell.vn")) {
          if (parsed.name === "Độc giả The Inkwell" || parsed.name === "Độc giả Minh Anh" || !parsed.name) {
            if (parsed.email.toLowerCase().includes("thaotrang")) {
              parsed.name = "Thảo Trang";
            } else {
              const prefix = parsed.email.split("@")[0];
              parsed.name = prefix
                .split(/[._-]/)
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(" ");
            }
            hasModified = true;
          }
          if (parsed.user_id === 35 || parsed.user_id === 1 || !parsed.user_id) {
            parsed.user_id = Math.floor(10000 + Math.random() * 90000);
            hasModified = true;
          }
        }

        if (hasModified) {
          localStorage.setItem("inkwell_user", JSON.stringify(parsed));
        }

        setUser(parsed);
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
