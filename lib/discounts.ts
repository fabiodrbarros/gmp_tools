import { db } from "@/lib/db";

export interface CustomerDiscountContext {
  generalPct: number;
  byCategoryId: Record<string, number>; // categoryId -> pct (overrides general)
  quantityTiers: { minQty: number; discountPct: number }[]; // per-customer, summed on top
}

/** Loads a customer's general + per-category + quantity discounts. Null if no/invalid customer. */
export async function loadCustomerDiscountContext(customerId: string | null): Promise<CustomerDiscountContext | null> {
  if (!customerId) return null;
  try {
    const c = await db.customer.findUnique({
      where: { id: customerId },
      include: { categoryDiscounts: true, quantityTiers: true },
    });
    if (!c || !c.isActive) return null;
    const byCategoryId: Record<string, number> = {};
    for (const d of c.categoryDiscounts) byCategoryId[d.categoryId] = d.discountPct;
    const quantityTiers = c.quantityTiers.map((t) => ({ minQty: t.minQty, discountPct: t.discountPct }));
    return { generalPct: c.discountPct, byCategoryId, quantityTiers };
  } catch {
    return null;
  }
}

/** Base customer discount for a product's category (category override wins over general). */
export function customerDiscountFor(ctx: CustomerDiscountContext | null, categoryId: string | null | undefined): number {
  if (!ctx) return 0;
  if (categoryId && ctx.byCategoryId[categoryId] != null) return ctx.byCategoryId[categoryId];
  return ctx.generalPct;
}

/** Best matching per-product quantity-tier discount for a given quantity. */
export function quantityDiscount(tiers: { minQty: number; discountPct: number }[], qty: number): number {
  let best = 0;
  for (const t of tiers) if (qty >= t.minQty && t.discountPct > best) best = t.discountPct;
  return best;
}

/** Customer discount + quantity discount, summed and capped. */
export function effectiveDiscountPct(customerPct: number, qtyPct: number): number {
  return Math.min(90, Math.max(0, Math.round((customerPct + qtyPct) * 100) / 100));
}

export function applyDiscount(price: number, pct: number): number {
  return Math.round(price * (1 - pct / 100) * 100) / 100;
}
