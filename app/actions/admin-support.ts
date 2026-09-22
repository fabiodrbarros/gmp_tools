"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { saveAttachments } from "@/lib/upload";

const STATUSES = ["OPEN", "ANSWERED", "CLOSED"];

export async function adminReplyTicket(ticketId: string, formData: FormData) {
  const body = ((formData.get("body") as string) || "").trim();
  const files = formData.getAll("attachments").filter((f): f is File => f instanceof File);
  if (body.length < 1 && !files.some((f) => f.size > 0)) return { success: false as const, error: "Escreva uma mensagem." };

  try {
    const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) return { success: false as const, error: "Ticket não encontrado." };
    const urls = await saveAttachments(files);
    await db.ticketMessage.create({
      data: { ticketId, author: "ADMIN", body, attachments: urls.length ? JSON.stringify(urls) : null },
    });
    await db.supportTicket.update({ where: { id: ticketId }, data: { status: "ANSWERED", updatedAt: new Date() } });
    revalidatePath(`/gmp-panel-admin/suporte/${ticketId}`);
    revalidatePath("/gmp-panel-admin/suporte");
    revalidatePath(`/conta/suporte/${ticketId}`);
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Erro ao responder." };
  }
}

export async function setTicketStatus(id: string, status: string) {
  if (!STATUSES.includes(status)) return { success: false, error: "Estado inválido." };
  try {
    await db.supportTicket.update({ where: { id }, data: { status } });
    revalidatePath("/gmp-panel-admin/suporte");
    revalidatePath(`/gmp-panel-admin/suporte/${id}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao actualizar o estado." };
  }
}
