"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/customer-auth";

const schema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome obrigatório"),
  company: z.string().optional(),
  phone: z.string().optional(),
  discountPct: z.number().min(0).max(90),
  isActive: z.boolean(),
});

function readForm(formData: FormData) {
  const num = (v: FormDataEntryValue | null) => {
    const n = Number(((v as string) || "").replace(",", "."));
    return isNaN(n) ? 0 : n;
  };
  const s = (k: string) => ((formData.get(k) as string) || "").trim() || null;
  return {
    base: schema.safeParse({
      email: ((formData.get("email") as string) || "").trim().toLowerCase(),
      name: ((formData.get("name") as string) || "").trim(),
      company: ((formData.get("company") as string) || "").trim() || undefined,
      phone: ((formData.get("phone") as string) || "").trim() || undefined,
      discountPct: num(formData.get("discountPct")),
      isActive: formData.get("isActive") === "on",
    }),
    address: { taxId: s("taxId"), address: s("address"), postalCode: s("postalCode"), city: s("city") },
    password: ((formData.get("password") as string) || "").trim(),
    // category overrides: inputs named catDisc_<categoryId>
    categoryDiscounts: [...formData.entries()]
      .filter(([k]) => k.startsWith("catDisc_"))
      .map(([k, v]) => ({ categoryId: k.slice("catDisc_".length), discountPct: num(v) }))
      .filter((d) => d.categoryId && d.discountPct > 0),
    // per-customer quantity tiers: parallel tierQty[]/tierPct[]
    quantityTiers: (() => {
      const qtys = formData.getAll("tierQty").map((v) => Math.floor(Number(v)));
      const pcts = formData.getAll("tierPct").map((v) => Number(v));
      const tiers: { minQty: number; discountPct: number }[] = [];
      for (let i = 0; i < qtys.length; i++) {
        const minQty = qtys[i];
        const discountPct = Math.min(90, Math.max(0, pcts[i] || 0));
        if (minQty >= 1 && discountPct > 0) tiers.push({ minQty, discountPct });
      }
      return tiers;
    })(),
  };
}

export async function createCustomer(formData: FormData) {
  const { base, address, password, categoryDiscounts, quantityTiers } = readForm(formData);
  if (!base.success) return { success: false, error: base.error.issues[0]?.message ?? "Dados inválidos." };
  if (password.length < 6) return { success: false, error: "A palavra-passe tem de ter pelo menos 6 caracteres." };

  try {
    await db.customer.create({
      data: {
        email: base.data.email,
        name: base.data.name,
        company: base.data.company ?? null,
        phone: base.data.phone ?? null,
        ...address,
        discountPct: base.data.discountPct,
        isActive: base.data.isActive,
        passwordHash: await hashPassword(password),
        categoryDiscounts: { create: categoryDiscounts },
        quantityTiers: { create: quantityTiers },
      },
    });
    revalidatePath("/gmp-panel-admin/clientes");
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) return { success: false, error: "Já existe um cliente com este email." };
    console.error(e);
    return { success: false, error: "Erro ao criar o cliente." };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const { base, address, password, categoryDiscounts, quantityTiers } = readForm(formData);
  if (!base.success) return { success: false, error: base.error.issues[0]?.message ?? "Dados inválidos." };
  if (password && password.length < 6) return { success: false, error: "A nova palavra-passe tem de ter pelo menos 6 caracteres." };

  try {
    await db.customerCategoryDiscount.deleteMany({ where: { customerId: id } });
    await db.customerQuantityTier.deleteMany({ where: { customerId: id } });
    await db.customer.update({
      where: { id },
      data: {
        email: base.data.email,
        name: base.data.name,
        company: base.data.company ?? null,
        phone: base.data.phone ?? null,
        ...address,
        discountPct: base.data.discountPct,
        isActive: base.data.isActive,
        ...(password ? { passwordHash: await hashPassword(password), mustChangePassword: true } : {}),
        categoryDiscounts: { create: categoryDiscounts },
        quantityTiers: { create: quantityTiers },
      },
    });
    revalidatePath("/gmp-panel-admin/clientes");
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) return { success: false, error: "Já existe um cliente com este email." };
    console.error(e);
    return { success: false, error: "Erro ao actualizar o cliente." };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db.customer.delete({ where: { id } });
    revalidatePath("/gmp-panel-admin/clientes");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao apagar o cliente." };
  }
}
