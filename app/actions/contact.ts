"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  try {
    await db.contactMessage.create({ data: parsed.data });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao enviar mensagem." };
  }
}
