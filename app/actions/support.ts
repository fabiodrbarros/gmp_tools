"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCustomer } from "@/lib/customer-auth";
import { saveAttachments } from "@/lib/upload";

function readAttachments(formData: FormData) {
  return formData.getAll("attachments").filter((f): f is File => f instanceof File);
}

export async function createTicket(formData: FormData) {
  const session = await getCustomer();
  if (!session) return { success: false as const, error: "A sessão expirou." };

  const subject = ((formData.get("subject") as string) || "").trim();
  const body = ((formData.get("body") as string) || "").trim();
  if (subject.length < 3) return { success: false as const, error: "Indique um assunto." };
  if (body.length < 3) return { success: false as const, error: "Descreva o problema." };

  try {
    const urls = await saveAttachments(readAttachments(formData));
    const ticket = await db.supportTicket.create({
      data: {
        customerId: session.id,
        subject,
        status: "OPEN",
        messages: { create: [{ author: "CUSTOMER", body, attachments: urls.length ? JSON.stringify(urls) : null }] },
      },
    });
    revalidatePath("/conta/suporte");
    revalidatePath("/gmp-panel-admin/suporte");
    return { success: true as const, ticketId: ticket.id };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Erro ao abrir o ticket." };
  }
}

export async function replyTicket(ticketId: string, formData: FormData) {
  const session = await getCustomer();
  if (!session) return { success: false as const, error: "A sessão expirou." };

  const body = ((formData.get("body") as string) || "").trim();
  if (body.length < 1 && !readAttachments(formData).some((f) => f.size > 0)) {
    return { success: false as const, error: "Escreva uma mensagem." };
  }

  try {
    const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket || ticket.customerId !== session.id) return { success: false as const, error: "Ticket não encontrado." };
    if (ticket.status === "CLOSED") return { success: false as const, error: "Este ticket está fechado." };

    const urls = await saveAttachments(readAttachments(formData));
    await db.ticketMessage.create({
      data: { ticketId, author: "CUSTOMER", body, attachments: urls.length ? JSON.stringify(urls) : null },
    });
    await db.supportTicket.update({ where: { id: ticketId }, data: { status: "OPEN", updatedAt: new Date() } });
    revalidatePath(`/conta/suporte/${ticketId}`);
    revalidatePath("/gmp-panel-admin/suporte");
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Erro ao enviar a mensagem." };
  }
}
