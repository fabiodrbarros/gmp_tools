"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCustomer, verifyPassword, hashPassword } from "@/lib/customer-auth";

export async function changePassword(formData: FormData) {
  const session = await getCustomer();
  if (!session) return { success: false as const, error: "A sessão expirou." };

  const current = (formData.get("current") as string) || "";
  const next = (formData.get("next") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (next.length < 6) return { success: false as const, error: "A nova palavra-passe tem de ter pelo menos 6 caracteres." };
  if (next !== confirm) return { success: false as const, error: "As palavras-passe não coincidem." };

  const c = await db.customer.findUnique({ where: { id: session.id } });
  if (!c) return { success: false as const, error: "A sessão expirou." };
  if (!(await verifyPassword(current, c.passwordHash))) {
    return { success: false as const, error: "A palavra-passe atual está incorreta." };
  }
  if (await verifyPassword(next, c.passwordHash)) {
    return { success: false as const, error: "A nova palavra-passe tem de ser diferente da atual." };
  }

  await db.customer.update({
    where: { id: session.id },
    data: { passwordHash: await hashPassword(next), mustChangePassword: false },
  });
  revalidatePath("/conta");
  return { success: true as const };
}
