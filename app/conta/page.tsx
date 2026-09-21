import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package } from "lucide-react";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { customerLogout } from "@/app/actions/customer-auth";
import { ProfileForm } from "@/components/customer/profile-form";

export const metadata: Metadata = { title: "A minha conta" };

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}
const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pendente", cls: "bg-amber-50 text-amber-600" },
  CONFIRMED: { label: "Confirmada", cls: "bg-green-50 text-green-600" },
  CANCELLED: { label: "Cancelada", cls: "bg-gray-100 text-gray-400" },
};

export default async function ContaPage() {
  const session = await getCustomer();
  if (!session) redirect("/entrar");

  const [customer, orders] = await Promise.all([
    db.customer.findUnique({ where: { id: session.id } }),
    db.customerOrder.findMany({
      where: { customerId: session.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 20,
    }),
  ]);
  if (!customer) redirect("/entrar");

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-medium text-black tracking-tight">A minha conta</h1>
            <p className="text-gray-500 mt-1">{customer.name}{customer.company ? ` · ${customer.company}` : ""}</p>
          </div>
          <form action={customerLogout}>
            <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" /> Terminar sessão
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 grid lg:grid-cols-2 gap-12">
        {/* Orders */}
        <div>
          <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-4">Encomendas</h2>
          {orders.length === 0 ? (
            <div className="border border-gray-100 p-10 text-center">
              <Package className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Ainda não tem encomendas.</p>
              <Link href="/produtos" className="inline-flex items-center gap-2 mt-6 bg-black text-white text-sm font-semibold px-6 py-3 hover:bg-red-600 transition-colors">Ver catálogo</Link>
            </div>
          ) : (
            <div className="border border-gray-100 divide-y divide-gray-100">
              {orders.map((o) => {
                const st = STATUS[o.status] ?? STATUS.PENDING;
                return (
                  <div key={o.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Encomenda #{o.id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{fmtDate(o.createdAt)} · {o.items.length} artigo{o.items.length !== 1 ? "s" : ""}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${st.cls}`}>{st.label}</span>
                      <span className="font-semibold text-black text-sm">{fmt(o.subtotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile / address */}
        <div>
          <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-4">Os meus dados</h2>
          <ProfileForm
            initial={{
              name: customer.name,
              email: customer.email,
              company: customer.company,
              phone: customer.phone,
              taxId: customer.taxId,
              address: customer.address,
              postalCode: customer.postalCode,
              city: customer.city,
            }}
          />
        </div>
      </div>
    </div>
  );
}
