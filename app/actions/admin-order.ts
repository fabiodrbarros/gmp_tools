"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

export async function setOrderStatus(id: string, status: string) {
  if (!STATUSES.includes(status)) return { success: false, error: "Estado inválido." };
  try {
    await db.customerOrder.update({ where: { id }, data: { status } });
    revalidatePath("/gmp-panel-admin/encomendas");
    revalidatePath(`/gmp-panel-admin/encomendas/${id}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao actualizar o estado." };
  }
}

export async function deleteOrder(id: string) {
  try {
    await db.customerOrder.delete({ where: { id } });
    revalidatePath("/gmp-panel-admin/encomendas");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao apagar a encomenda." };
  }
}
