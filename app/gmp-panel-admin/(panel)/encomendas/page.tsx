import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { db } from "@/lib/db";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const metadata: Metadata = { title: "Encomendas" };

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

async function getOrders() {
  try {
    return await db.customerOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, _count: { select: { items: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminEncomendasPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Encomendas</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orders.length} encomenda{orders.length !== 1 ? "s" : ""} de clientes</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <ShoppingCart className="h-8 w-8 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Ainda não há encomendas.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Ref.</th>
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Data</th>
                <th className="px-5 py-3 font-semibold">Artigos</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Ver</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">#{o.id.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {o.customer.name}
                    {o.customer.company && <span className="block text-xs font-normal text-gray-400">{o.customer.company}</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{fmtDate(o.createdAt)}</td>
                  <td className="px-5 py-3 text-gray-500">{o._count.items}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">{fmt(o.subtotal)}</td>
                  <td className="px-5 py-3"><OrderStatusSelect id={o.id} value={o.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <Link href={`/gmp-panel-admin/encomendas/${o.id}`} title="Ver" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
