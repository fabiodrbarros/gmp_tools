"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCustomer } from "@/lib/customer-auth";
import {
  loadCustomerDiscountContext,
  customerDiscountFor,
  quantityDiscount,
  effectiveDiscountPct,
  applyDiscount,
} from "@/lib/discounts";

export interface OrderLineInput {
  sku: string;
  qty: number;
}

// Server recomputes all prices/discounts from the DB — client cart prices are never trusted.
export async function submitOrder(rawItems: OrderLineInput[], notes?: string) {
  const customer = await getCustomer();
  if (!customer) return { success: false as const, error: "A sessão expirou. Inicie sessão novamente." };

  const items = (rawItems || []).filter((i) => i && i.sku && i.qty > 0);
  if (!items.length) return { success: false as const, error: "O carrinho está vazio." };

  const ctx = await loadCustomerDiscountContext(customer.id);

  try {
    const products = await db.product.findMany({
      where: { sku: { in: items.map((i) => i.sku) }, isActive: true },
      include: { quantityTiers: true },
    });
    const bySku = new Map(products.map((p) => [p.sku, p]));

    const lines: {
      productId: string; sku: string; name: string; qty: number;
      unitPrice: number; discountPct: number; lineTotal: number;
    }[] = [];
    let subtotal = 0;

    for (const it of items) {
      const p = bySku.get(it.sku);
      if (!p || p.quoteOnly || p.price == null) continue;
      const qty = Math.max(1, Math.floor(it.qty));
      const custPct = customerDiscountFor(ctx, p.categoryId);
      const qtyPct = quantityDiscount(p.quantityTiers, qty);
      const pct = effectiveDiscountPct(custPct, qtyPct);
      const lineTotal = Math.round(applyDiscount(p.price, pct) * qty * 100) / 100;
      subtotal += lineTotal;
      lines.push({ productId: p.id, sku: p.sku, name: p.name, qty, unitPrice: p.price, discountPct: pct, lineTotal });
    }

    if (!lines.length) return { success: false as const, error: "Nenhum artigo válido para encomendar." };
    subtotal = Math.round(subtotal * 100) / 100;

    const order = await db.customerOrder.create({
      data: {
        customerId: customer.id,
        subtotal,
        notes: notes?.trim() || null,
        items: { create: lines },
      },
    });

    revalidatePath("/gmp-panel-admin/encomendas");
    revalidatePath("/conta");
    return { success: true as const, orderId: order.id };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Erro ao registar a encomenda." };
  }
}
