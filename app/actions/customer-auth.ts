"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword, setCustomerSession, clearCustomerSession } from "@/lib/customer-auth";

export async function customerLogin(_prev: { error?: string } | null, formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  if (!email || !password) return { error: "Preencha o email e a palavra-passe." };

  const c = await db.customer.findUnique({ where: { email } }).catch(() => null);
  if (!c || !c.isActive || !(await verifyPassword(password, c.passwordHash))) {
    return { error: "Email ou palavra-passe inválidos." };
  }

  await setCustomerSession(c.id);
  redirect("/conta");
}

export async function customerLogout() {
  await clearCustomerSession();
  redirect("/entrar");
}
