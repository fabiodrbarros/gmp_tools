import Link from "next/link";
import { ShoppingCart, LifeBuoy, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { orderStatus } from "@/lib/order-status";
import { ticketStatus } from "@/lib/ticket-status";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

async function getData() {
  try {
    const [ordersTotal, ordersPending, ticketsTotal, ticketsOpen, recentOrders, recentTickets] = await Promise.all([
      db.customerOrder.count(),
      db.customerOrder.count({ where: { status: "PENDING" } }),
      db.supportTicket.count(),
      db.supportTicket.count({ where: { status: { in: ["OPEN"] } } }),
      db.customerOrder.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true, _count: { select: { items: true } } } }),
      db.supportTicket.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { customer: true } }),
    ]);
    return { ordersTotal, ordersPending, ticketsTotal, ticketsOpen, recentOrders, recentTickets };
  } catch {
    return { ordersTotal: 0, ordersPending: 0, ticketsTotal: 0, ticketsOpen: 0, recentOrders: [], recentTickets: [] };
  }
}

export default async function AdminPage() {
  const d = await getData();

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link href="/gmp-panel-admin/encomendas" className="group bg-white border border-gray-100 p-6 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="h-5 w-5 text-gray-300" />
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-4xl font-medium text-gray-900">{d.ordersTotal}</div>
          <div className="text-sm text-gray-500 mt-1">Encomendas · <span className="text-amber-600 font-medium">{d.ordersPending} pendente{d.ordersPending !== 1 ? "s" : ""}</span></div>
        </Link>
        <Link href="/gmp-panel-admin/suporte" className="group bg-white border border-gray-100 p-6 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <LifeBuoy className="h-5 w-5 text-gray-300" />
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-4xl font-medium text-gray-900">{d.ticketsTotal}</div>
          <div className="text-sm text-gray-500 mt-1">Tickets · <span className="text-amber-600 font-medium">{d.ticketsOpen} por responder</span></div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-black uppercase tracking-wider">Últimas encomendas</h2>
            <Link href="/gmp-panel-admin/encomendas" className="text-xs text-gray-500 hover:text-black transition-colors">Ver todas</Link>
          </div>
          <div className="bg-white border border-gray-100 divide-y divide-gray-100">
            {d.recentOrders.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">Sem encomendas.</p>
            ) : d.recentOrders.map((o) => {
              const st = orderStatus(o.status);
              return (
                <Link key={o.id} href={`/gmp-panel-admin/encomendas/${o.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{o.customer.name}</div>
                    <div className="text-xs text-gray-400">#{o.id.slice(-6).toUpperCase()} · {fmtDate(o.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${st.cls}`}>{st.label}</span>
                    <span className="text-sm font-medium text-gray-900">{fmt(o.subtotal)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent tickets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-black uppercase tracking-wider">Últimos tickets</h2>
            <Link href="/gmp-panel-admin/suporte" className="text-xs text-gray-500 hover:text-black transition-colors">Ver todos</Link>
          </div>
          <div className="bg-white border border-gray-100 divide-y divide-gray-100">
            {d.recentTickets.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">Sem tickets.</p>
            ) : d.recentTickets.map((t) => {
              const st = ticketStatus(t.status);
              return (
                <Link key={t.id} href={`/gmp-panel-admin/suporte/${t.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{t.subject}</div>
                    <div className="text-xs text-gray-400 truncate">{t.customer.name} · {fmtDate(t.updatedAt)}</div>
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 shrink-0 ${st.cls}`}>{st.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
