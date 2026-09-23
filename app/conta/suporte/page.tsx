import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LifeBuoy } from "lucide-react";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { ticketStatus } from "@/lib/ticket-status";
import { NewTicketForm } from "@/components/customer/new-ticket-form";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Suporte" };

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ContaSuportePage() {
  const session = await getCustomer();
  if (!session) redirect("/entrar");

  const tickets = await db.supportTicket.findMany({
    where: { customerId: session.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });
  const { t: tr } = await getT();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-5">{tr("sup.title")}</h2>
        {tickets.length === 0 ? (
          <div className="border border-gray-100 p-8 text-center mb-8">
            <LifeBuoy className="h-8 w-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{tr("sup.none")}</p>
          </div>
        ) : (
          <div className="border border-gray-100 divide-y divide-gray-100 mb-8">
            {tickets.map((t) => {
              const st = ticketStatus(t.status);
              return (
                <Link key={t.id} href={`/conta/suporte/${t.id}`} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{t.subject}</div>
                    <div className="text-xs text-gray-400">#{t.id.slice(-6).toUpperCase()} · {fmtDate(t.updatedAt)} · {t._count.messages} {t._count.messages !== 1 ? tr("sup.msgs") : tr("sup.msg")}</div>
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${st.cls}`}>{tr(`ticket.st.${t.status}`)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <NewTicketForm />
    </div>
  );
}
