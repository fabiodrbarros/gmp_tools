import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "Encomenda" };

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleString("pt-PT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pendente", cls: "bg-amber-50 text-amber-600" },
  CONFIRMED: { label: "Confirmada", cls: "bg-green-50 text-green-600" },
  CANCELLED: { label: "Cancelada", cls: "bg-gray-100 text-gray-400" },
};

export default async function ContaEncomendaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomer();
  if (!session) redirect("/entrar");
  const { id } = await params;

  const order = await db.customerOrder.findUnique({ where: { id }, include: { items: true } }).catch(() => null);
  // only the owner may see it
  if (!order || order.customerId !== session.id) notFound();

  const st = STATUS[order.status] ?? STATUS.PENDING;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/conta" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> A minha conta
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-medium text-black tracking-tight">Encomenda #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-sm text-gray-500 mt-1">{fmtDate(order.createdAt)}</p>
          </div>
          <span className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 ${st.cls}`}>{st.label}</span>
        </div>

        <div className="border border-gray-100 overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Artigo</th>
                <th className="px-5 py-3 font-semibold text-center">Qt.</th>
                <th className="px-5 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <span className="font-medium text-gray-900">{it.name}</span>
                    <span className="block text-xs text-gray-400 font-mono">{it.sku}</span>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-600">{it.qty}</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">{fmt(it.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-100">
                <td colSpan={2} className="px-5 py-3 text-right font-medium text-gray-500">Subtotal (sem IVA)</td>
                <td className="px-5 py-3 text-right font-semibold text-black">{fmt(order.subtotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {order.notes && (
          <div className="border border-gray-100 p-6">
            <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-2">Notas</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
