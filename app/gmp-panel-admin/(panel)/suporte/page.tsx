import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Eye } from "lucide-react";
import { db } from "@/lib/db";
import { ticketStatus } from "@/lib/ticket-status";

export const metadata: Metadata = { title: "Suporte" };

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

async function getTickets() {
  try {
    return await db.supportTicket.findMany({
      orderBy: { updatedAt: "desc" },
      include: { customer: true, _count: { select: { messages: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminSuportePage() {
  const tickets = await getTickets();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Suporte</h1>
        <p className="text-sm text-gray-500 mt-0.5">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <LifeBuoy className="h-8 w-8 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Ainda não há tickets de suporte.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Assunto</th>
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Atualizado</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Ver</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => {
                const st = ticketStatus(t.status);
                return (
                  <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {t.subject}
                      <span className="block text-xs font-normal text-gray-400 font-mono">#{t.id.slice(-6).toUpperCase()} · {t._count.messages} msg</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{t.customer.name}{t.customer.company ? ` · ${t.customer.company}` : ""}</td>
                    <td className="px-5 py-3 text-gray-500">{fmtDate(t.updatedAt)}</td>
                    <td className="px-5 py-3"><span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${st.cls}`}>{st.label}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <Link href={`/gmp-panel-admin/suporte/${t.id}`} title="Ver" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
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
