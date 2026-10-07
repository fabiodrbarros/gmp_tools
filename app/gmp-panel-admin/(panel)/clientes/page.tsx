import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Users, Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { deleteCustomer } from "@/app/actions/admin-customer";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Clientes" };

async function getCustomers() {
  try {
    return await db.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminClientesPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{customers.length} conta{customers.length !== 1 ? "s" : ""} de cliente</p>
        </div>
        <Link href="/gmp-panel-admin/clientes/novo" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
          <Plus className="h-4 w-4" /> Novo cliente
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <Users className="h-8 w-8 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm mb-6">Ainda não há contas de cliente.</p>
          <Link href="/gmp-panel-admin/clientes/novo" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
            <Plus className="h-4 w-4" /> Criar o primeiro cliente
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Desconto</th>
                <th className="px-5 py-3 font-semibold">Encomendas</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Acções</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {c.name}
                    {c.company && <span className="block text-xs font-normal text-gray-400">{c.company}</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{c.email}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">{c.discountPct}%</td>
                  <td className="px-5 py-3 text-gray-500">{c._count.orders}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${c.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {c.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/gmp-panel-admin/clientes/${c.id}`} title="Editar" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteCustomer} id={c.id} confirmLabel={`Apagar o cliente "${c.name}"? Esta acção é irreversível.`} />
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
