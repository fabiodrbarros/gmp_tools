import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Cpu, Pencil, Languages } from "lucide-react";
import { db } from "@/lib/db";
import { deleteMachine } from "@/app/actions/admin-machine";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Máquinas" };

async function getMachines() {
  try {
    return await db.machine.findMany({ orderBy: { createdAt: "desc" }, include: { brand: true } });
  } catch {
    return [];
  }
}

const COND: Record<string, { label: string; cls: string }> = {
  NEW: { label: "Nova", cls: "bg-green-50 text-green-600" },
  REFURBISHED: { label: "Recondicionada", cls: "bg-red-50 text-red-600" },
  USED: { label: "Usada", cls: "bg-gray-100 text-gray-500" },
};

function fmt(n: number | null) {
  if (n == null) return "Sob consulta";
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function AdminMaquinasPage() {
  const machines = await getMachines();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Máquinas</h1>
          <p className="text-sm text-gray-500 mt-0.5">{machines.length} máquina{machines.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/gmp-panel-admin/maquinas/nova" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
          <Plus className="h-4 w-4" /> Nova máquina
        </Link>
      </div>

      {machines.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <Cpu className="h-8 w-8 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm mb-6">Ainda não há máquinas na base de dados.</p>
          <Link href="/gmp-panel-admin/maquinas/nova" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
            <Plus className="h-4 w-4" /> Criar a primeira máquina
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Máquina</th>
                <th className="px-5 py-3 font-semibold">Marca</th>
                <th className="px-5 py-3 font-semibold">Categoria</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Preço</th>
                <th className="px-5 py-3 font-semibold text-right">Acções</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => {
                const c = COND[m.condition] ?? COND.NEW;
                return (
                  <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {m.name}
                      {m.year && <span className="ml-2 text-xs text-gray-400">({m.year})</span>}
                      {m.isFeatured && <span className="ml-2 text-[9px] font-medium uppercase tracking-wider text-red-600">Destaque</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{m.brand?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{m.category ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${c.cls}`}>{c.label}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-900 font-medium">{fmt(m.price)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/gmp-panel-admin/maquinas/${m.id}`} title="Editar" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Link href={`/gmp-panel-admin/traducoes/machine/${m.id}`} title="Traduções EN/FR" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                          <Languages className="h-4 w-4" />
                        </Link>
                        <DeleteButton action={deleteMachine} id={m.id} confirmLabel={`Apagar a máquina "${m.name}"? Esta acção é irreversível.`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
