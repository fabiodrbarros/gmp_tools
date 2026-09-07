"use client";

import * as React from "react";

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (sku: string) => void;
  update: (sku: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = React.createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gmp-cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem("gmp-cart", JSON.stringify(items));
  }, [items]);

  function add(item: Omit<CartItem, "qty">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === item.sku);
      if (existing) return prev.map((i) => i.sku === item.sku ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function remove(sku: string) {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }

  function update(sku: string, qty: number) {
    if (qty < 1) { remove(sku); return; }
    setItems((prev) => prev.map((i) => i.sku === sku ? { ...i, qty } : i));
  }

  function clear() { setItems([]); }

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, update, clear, count, subtotal }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
