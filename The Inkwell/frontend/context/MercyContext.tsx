"use client";

import React, { createContext, useContext, useState } from "react";
import MercyChatDrawer from "@/components/MercyChatDrawer";

type MercyContextType = {
  isOpen: boolean;
  openMercy: (prompt?: string) => void;
  closeMercy: () => void;
  toggleMercy: () => void;
};

const MercyContext = createContext<MercyContextType | undefined>(undefined);

export function MercyProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  const openMercy = (prompt?: string) => {
    if (prompt) {
      setInitialPrompt(prompt);
    }
    setIsOpen(true);
  };

  const closeMercy = () => {
    setIsOpen(false);
  };

  const toggleMercy = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <MercyContext.Provider value={{ isOpen, openMercy, closeMercy, toggleMercy }}>
      {children}
      <MercyChatDrawer isOpen={isOpen} onClose={closeMercy} initialPrompt={initialPrompt} />
    </MercyContext.Provider>
  );
}

export function useMercy() {
  const context = useContext(MercyContext);
  if (!context) {
    throw new Error("useMercy must be used within a MercyProvider");
  }
  return context;
}
