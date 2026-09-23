"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { submitOrder } from "@/app/actions/order";
import { useConfirm } from "@/components/ui/confirm";
import { useLang } from "@/lib/i18n";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

export interface CheckoutAddress {
  address: string;
  postalCode: string;
  city: string;
}

export function CustomerCheckout({ initialAddress }: { initialAddress?: CheckoutAddress }) {
  const { items, subtotal, clear } = useCart();
  const [notes, setNotes] = React.useState("");
  const [address, setAddress] = React.useState(initialAddress?.address ?? "");
  const [postalCode, setPostalCode] = React.useState(initialAddress?.postalCode ?? "");
  const [city, setCity] = React.useState(initialAddress?.city ?? "");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const askConfirm = useConfirm();
  const { t } = useLang();

  async function confirm() {
    if (!address.trim()) { setError(t("co.addrError")); return; }
    const ok = await askConfirm({
      title: t("co.confirmTitle"),
      message: `${[address, postalCode, city].filter(Boolean).join(", ")}`,
      confirmLabel: t("co.confirm"),
    });
    if (!ok) return;
    setPending(true);
    setError("");
    const res = await submitOrder(items.map((i) => ({ sku: i.sku, qty: i.qty })), notes, { address, postalCode, city });
    setPending(false);
    if (res.success) {
      setOrderId(res.orderId);
      clear();
    } else {
      setError(res.error);
    }
  }

  if (orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500 mb-6" />
        <h1 className="text-3xl font-medium text-black mb-2">{t("co.sentTitle")}</h1>
        <p className="text-gray-500 mb-1">{t("co.ref")} #{orderId.slice(-6).toUpperCase()}</p>
        <p className="text-gray-500 mb-8 max-w-md">{t("co.sentBody")}</p>
        <Link href="/conta" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors group">
          {t("co.viewOrders")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingCart className="h-14 w-14 text-gray-100 mb-6" />
        <h1 className="text-3xl font-medium text-black mb-3">{t("cartp.empty")}</h1>
        <Link href="/produtos" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors">
          {t("acct.viewCatalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-medium text-black">{t("co.title")}</h1>
          <p className="text-gray-500 mt-1">{t("co.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="border border-gray-100 divide-y divide-gray-100 mb-6">
          {items.map((i) => (
            <div key={i.sku} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <div className="font-medium text-gray-900 text-sm">{i.name}</div>
                <div className="text-xs text-gray-400">{i.sku} · {i.qty} × {fmt(i.price)}</div>
              </div>
              <div className="font-semibold text-black text-sm">{fmt(i.price * i.qty)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm mb-8">
          <span className="text-gray-500">{t("co.subtotalNoVat")}</span>
          <span className="font-semibold text-black">{fmt(subtotal)}</span>
        </div>

        <h2 className="text-sm font-medium text-black mb-3">{t("co.delivery")}</h2>
        <p className="text-[12px] text-gray-400 mb-3">{t("co.deliveryHint")}</p>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("co.addrPh")}
          className="w-full border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors mb-3"
        />
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder={t("co.postalPh")} className="w-full border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("co.cityPh")} className="w-full border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>

        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("co.notes")}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t("co.notesPh")}
          className="w-full border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors mb-6"
        />

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

        <div className="flex items-center gap-3">
          <button
            onClick={confirm}
            disabled={pending}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors disabled:opacity-50 group"
          >
            {pending ? t("co.confirming") : t("co.confirm")}
            {!pending && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </button>
          <Link href="/carrinho" className="text-sm text-gray-500 hover:text-black transition-colors">{t("co.back")}</Link>
        </div>
      </div>
    </div>
  );
}
