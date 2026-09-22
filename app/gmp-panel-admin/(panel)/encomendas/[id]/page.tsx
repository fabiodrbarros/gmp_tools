import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const metadata: Metadata = { title: "Encomenda" };

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleString("pt-PT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminEncomendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await db.customerOrder.findUnique({ where: { id }, include: { customer: true, items: true } }).catch(() => null);
  if (!o) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/gmp-panel-admin/encomendas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Encomendas
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Encomenda #{o.id.slice(-6).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1">{fmtDate(o.createdAt)}</p>
        </div>
        <OrderStatusSelect id={o.id} value={o.status} />
      </div>

      {/* Customer */}
      <div className="bg-white border border-gray-100 p-6 mb-5">
        <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-3">Cliente</h2>
        <div className="text-sm text-gray-700 space-y-0.5">
          <div className="font-medium text-gray-900">{o.customer.name}{o.customer.company ? ` · ${o.customer.company}` : ""}</div>
          <div>{o.customer.email}</div>
          {o.customer.phone && <div>{o.customer.phone}</div>}
        </div>
      </div>

      {o.address && (
        <div className="bg-white border border-gray-100 p-6 mb-5">
          <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-3">Morada de entrega</h2>
          <div className="text-sm text-gray-700">
            {o.address}
            {(o.postalCode || o.city) && <div>{[o.postalCode, o.city].filter(Boolean).join(" ")}</div>}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white border border-gray-100 overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
              <th className="px-5 py-3 font-semibold">Artigo</th>
              <th className="px-5 py-3 font-semibold text-center">Qt.</th>
              <th className="px-5 py-3 font-semibold text-right">Preço un.</th>
              <th className="px-5 py-3 font-semibold text-right">Desc.</th>
              <th className="px-5 py-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {o.items.map((it) => (
              <tr key={it.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3">
                  <span className="font-medium text-gray-900">{it.name}</span>
                  <span className="block text-xs text-gray-400 font-mono">{it.sku}</span>
                </td>
                <td className="px-5 py-3 text-center text-gray-600">{it.qty}</td>
                <td className="px-5 py-3 text-right text-gray-600">{fmt(it.unitPrice)}</td>
                <td className="px-5 py-3 text-right text-gray-600">{it.discountPct > 0 ? `−${it.discountPct}%` : "—"}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">{fmt(it.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100">
              <td colSpan={4} className="px-5 py-3 text-right font-medium text-gray-500">Subtotal (sem IVA)</td>
              <td className="px-5 py-3 text-right font-semibold text-black">{fmt(o.subtotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {o.notes && (
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-2">Notas do cliente</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{o.notes}</p>
        </div>
      )}
    </div>
  );
}
