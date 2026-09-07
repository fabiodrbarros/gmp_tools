"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(5),
  productName: z.string().optional(),
  productSku: z.string().optional(),
});

export async function submitQuote(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    company: formData.get("company") as string,
    message: formData.get("message") as string,
    productName: formData.get("productName") as string,
    productSku: formData.get("productSku") as string,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Por favor verifique o formulário." };
  }

  try {
    await db.quoteRequest.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        company: parsed.data.company || null,
        message: parsed.data.message,
        productName: parsed.data.productName
          ? `${parsed.data.productName} (${parsed.data.productSku})`
          : null,
      },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao enviar. Tente novamente." };
  }
}
