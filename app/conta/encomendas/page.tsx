import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { orderStatus } from "@/lib/order-status";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Encomendas" };

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ContaEncomendasPage() {
  const session = await getCustomer();
  if (!session) redirect("/entrar");

  const orders = await db.customerOrder.findMany({
    where: { customerId: session.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  const { t } = await getT();

  return (
    <div>
      <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-5">{t("acct.orders")}</h2>
      {orders.length === 0 ? (
        <div className="border border-gray-100 p-10 text-center">
          <Package className="h-8 w-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{t("acct.noOrders")}</p>
          <Link href="/produtos" className="inline-flex items-center gap-2 mt-6 bg-black text-white text-sm font-semibold px-6 py-3 hover:bg-red-600 transition-colors">{t("acct.viewCatalog")}</Link>
        </div>
      ) : (
        <div className="border border-gray-100 divide-y divide-gray-100">
          {orders.map((o) => {
            const st = orderStatus(o.status);
            return (
              <Link key={o.id} href={`/conta/encomendas/${o.id}`} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{t("acct.order")} #{o.id.slice(-6).toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{fmtDate(o.createdAt)} · {o.items.length} {o.items.length !== 1 ? t("acct.items") : t("acct.item")}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${st.cls}`}>{t(`order.st.${o.status}`)}</span>
                  <span className="font-semibold text-black text-sm">{fmt(o.subtotal)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
