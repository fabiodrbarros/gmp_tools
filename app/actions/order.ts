"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  company: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(7),
  notes: z.string().optional(),
  items: z.string().min(2),
  subtotal: z.number().positive(),
  shipping: z.number().min(0),
  total: z.number().positive(),
});

function orderNum() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `GMP-${ts}-${rand}`;
}

export async function submitOrder(data: {
  name: string; email: string; phone: string; company?: string;
  address: string; city: string; postalCode: string; notes?: string;
  items: string; subtotal: number; shipping: number; total: number;
}) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Dados inválidos." };

  try {
    const order = await db.order.create({
      data: {
        orderNumber: orderNum(),
        ...parsed.data,
        company: parsed.data.company || null,
        notes: parsed.data.notes || null,
      },
    });
    return { success: true, orderNumber: order.orderNumber };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao processar encomenda." };
  }
}
