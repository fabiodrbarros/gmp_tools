import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { ticketStatus } from "@/lib/ticket-status";
import { TicketThread } from "@/components/support/ticket-thread";
import { TicketReplyForm } from "@/components/customer/ticket-reply-form";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Ticket de suporte" };

export default async function ContaTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomer();
  if (!session) redirect("/entrar");
  const { id } = await params;

  const ticket = await db.supportTicket.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  }).catch(() => null);
  if (!ticket || ticket.customerId !== session.id) notFound();

  const st = ticketStatus(ticket.status);
  const { t } = await getT();

  return (
    <div>
      <Link href="/conta/suporte" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> {t("sup.back")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl font-medium text-black tracking-tight">{ticket.subject}</h2>
          <p className="text-xs text-gray-400 mt-1">#{ticket.id.slice(-6).toUpperCase()}</p>
        </div>
        <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 ${st.cls}`}>{t(`ticket.st.${ticket.status}`)}</span>
      </div>

      <div className="mb-6">
        <TicketThread messages={ticket.messages} viewer="CUSTOMER" customerLabel={t("sup.author.customer")} />
      </div>

      {ticket.status === "CLOSED" ? (
        <p className="text-sm text-gray-400 border border-gray-100 px-4 py-3">{t("sup.closed")}</p>
      ) : (
        <TicketReplyForm ticketId={ticket.id} />
      )}
    </div>
  );
}
