import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { TicketThread } from "@/components/support/ticket-thread";
import { AdminTicketReplyForm } from "@/components/admin/admin-ticket-reply-form";
import { TicketStatusControl } from "@/components/admin/ticket-status-control";

export const metadata: Metadata = { title: "Ticket" };

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await db.supportTicket.findUnique({
    where: { id },
    include: { customer: true, messages: { orderBy: { createdAt: "asc" } } },
  }).catch(() => null);
  if (!ticket) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/gmp-panel-admin/suporte" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Suporte
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl font-medium text-gray-900">{ticket.subject}</h1>
        <TicketStatusControl id={ticket.id} value={ticket.status} />
      </div>
      <p className="text-sm text-gray-500 mb-8">
        #{ticket.id.slice(-6).toUpperCase()} · {ticket.customer.name}{ticket.customer.company ? ` · ${ticket.customer.company}` : ""} · {ticket.customer.email}
      </p>

      <div className="mb-6">
        <TicketThread messages={ticket.messages} viewer="ADMIN" />
      </div>

      <AdminTicketReplyForm ticketId={ticket.id} />
    </div>
  );
}
