"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

export function CartPage() {
  const { items, remove, update, subtotal } = useCart();
  const { t } = useLang();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-100 mb-6" />
        <h1 className="text-3xl font-medium text-black mb-3">{t("cartp.empty")}</h1>
        <p className="text-gray-500 mb-8">{t("cartp.emptyBody")}</p>
        <Link href="/produtos" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors group">
          {t("acct.viewCatalog")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-medium text-black">{t("cartp.title")}</h1>
          <p className="text-gray-500 mt-1">{items.length} {items.length !== 1 ? t("cartp.products") : t("cartp.product")}</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-px bg-gray-200">
          {items.map((item) => (
            <div key={item.sku} className="bg-white flex items-start gap-4 p-4 sm:p-5">
              {/* Image placeholder */}
              <div className="h-16 w-16 bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 60 60" className="h-8 w-8 text-gray-200" fill="none">
                  <circle cx="30" cy="30" r="23" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="30" cy="30" r="7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-mono mb-0.5">{item.sku}</div>
                    <div className="text-sm font-medium text-black break-words">{item.name}</div>
                    <div className="text-sm font-medium text-black mt-1">{fmt(item.price)}</div>
                  </div>
                  <button
                    onClick={() => remove(item.sku)}
                    aria-label={t("cartp.remove")}
                    className="text-gray-300 hover:text-red-600 transition-colors shrink-0 p-1 -m-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 shrink-0">
                    <button
                      onClick={() => update(item.sku, item.qty - 1)}
                      aria-label="-"
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => update(item.sku, item.qty + 1)}
                      aria-label="+"
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-black text-right">
                    {fmt(item.price * item.qty)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white p-6 space-y-4">
            <h2 className="text-base font-medium text-black">{t("cartp.summary")}</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-medium text-black text-base">
                <span>{t("cartp.subtotal")}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="text-[11px] text-gray-400">{t("cartp.novat")}</div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-black text-white text-sm font-semibold py-4 hover:bg-red-600 transition-colors group"
            >
              {t("cartp.checkout")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
