"use client";

import * as React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart";

interface Props {
  sku: string;
  name: string;
  price: number;
}

export function AddToCart({ sku, name, price }: Props) {
  const { add, items } = useCart();
  const [added, setAdded] = React.useState(false);
  const inCart = items.some((i) => i.sku === sku);

  function handleAdd() {
    add({ sku, name, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3.5 transition-all ${
        added
          ? "bg-green-600 text-white"
          : "bg-black text-white hover:bg-red-600"
      }`}
    >
      {added ? (
        <><Check className="h-4 w-4" /> Adicionado ao carrinho</>
      ) : (
        <><ShoppingCart className="h-4 w-4" /> {inCart ? "Adicionar mais" : "Adicionar ao carrinho"}</>
      )}
    </button>
  );
}
