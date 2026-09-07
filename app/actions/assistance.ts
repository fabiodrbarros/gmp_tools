"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  company: z.string().optional(),
  machineType: z.string().min(2),
  urgency: z.enum(["NORMAL", "HIGH", "CRITICAL"]),
  description: z.string().min(10),
});

export async function submitAssistance(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    machineType: formData.get("machineType"),
    urgency: formData.get("urgency"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Por favor preencha todos os campos obrigatórios." };
  }

  try {
    await db.assistanceRequest.create({ data: parsed.data });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao enviar pedido." };
  }
}
