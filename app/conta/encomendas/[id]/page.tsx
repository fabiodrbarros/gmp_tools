import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { orderStatus } from "@/lib/order-status";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Encomenda" };

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleString("pt-PT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function ContaEncomendaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomer();
  if (!session) redirect("/entrar");
  const { id } = await params;

  const order = await db.customerOrder.findUnique({ where: { id }, include: { items: true } }).catch(() => null);
  // only the owner may see it
  if (!order || order.customerId !== session.id) notFound();

  const st = orderStatus(order.status);
  const { t } = await getT();

  return (
    <div>
      <div>
        <Link href="/conta/encomendas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> {t("acct.orders")}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-medium text-black tracking-tight">{t("acct.order")} #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-sm text-gray-500 mt-1">{fmtDate(order.createdAt)}</p>
          </div>
          <span className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 ${st.cls}`}>{t(`order.st.${order.status}`)}</span>
        </div>

        <div className="border border-gray-100 overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-3 sm:px-5 py-3 font-semibold">{t("acct.article")}</th>
                <th className="px-3 sm:px-5 py-3 font-semibold text-center">{t("acct.qty")}</th>
                <th className="px-3 sm:px-5 py-3 font-semibold text-right">{t("acct.total")}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 sm:px-5 py-3">
                    <span className="font-medium text-gray-900">{it.name}</span>
                    <span className="block text-xs text-gray-400 font-mono">{it.sku}</span>
                  </td>
                  <td className="px-3 sm:px-5 py-3 text-center text-gray-600">{it.qty}</td>
                  <td className="px-3 sm:px-5 py-3 text-right font-medium text-gray-900">{fmt(it.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-100">
                <td colSpan={2} className="px-3 sm:px-5 py-3 text-right font-medium text-gray-500">{t("acct.subtotalNoVat")}</td>
                <td className="px-3 sm:px-5 py-3 text-right font-semibold text-black">{fmt(order.subtotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {order.address && (
          <div className="border border-gray-100 p-6 mb-6">
            <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-2">{t("acct.deliveryAddress")}</h2>
            <p className="text-sm text-gray-700">
              {order.address}
              {(order.postalCode || order.city) && <span className="block">{[order.postalCode, order.city].filter(Boolean).join(" ")}</span>}
            </p>
          </div>
        )}

        {order.notes && (
          <div className="border border-gray-100 p-6">
            <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-2">{t("acct.notes")}</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
