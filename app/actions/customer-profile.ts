"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCustomer } from "@/lib/customer-auth";

// The customer can edit their own contact/address details — never their email, discount or status.
export async function updateProfile(formData: FormData) {
  const session = await getCustomer();
  if (!session) return { success: false, error: "A sessão expirou." };

  const s = (k: string) => ((formData.get(k) as string) || "").trim() || null;
  const name = s("name");
  if (!name) return { success: false, error: "O nome é obrigatório." };

  try {
    await db.customer.update({
      where: { id: session.id },
      data: {
        name,
        company: s("company"),
        phone: s("phone"),
        taxId: s("taxId"),
        address: s("address"),
        postalCode: s("postalCode"),
        city: s("city"),
      },
    });
    revalidatePath("/conta");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao guardar os dados." };
  }
}
