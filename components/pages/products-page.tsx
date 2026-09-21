import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { Catalog, type CatalogCategory, type CatalogItem } from "@/components/pages/catalog";
import { getCustomer } from "@/lib/customer-auth";
import { loadCustomerDiscountContext, customerDiscountFor, applyDiscount } from "@/lib/discounts";

async function load(pricesVisible: boolean, discountCtx: Awaited<ReturnType<typeof loadCustomerDiscountContext>>): Promise<{ categories: CatalogCategory[]; items: CatalogItem[] }> {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: { category: true, brand: true },
      orderBy: { createdAt: "asc" },
    });

    const catMap = new Map<string, string>();
    const items: CatalogItem[] = products.map((p) => {
      if (p.category) catMap.set(p.category.slug, p.category.name);
      const list = p.quoteOnly ? null : p.price;

      // Customer base discount for this product's category (quantity tiers apply in the cart).
      // The discount is internal — the customer just sees their final price, never the % or list price.
      let price = list;
      if (list != null && discountCtx) {
        const pct = customerDiscountFor(discountCtx, p.categoryId);
        if (pct > 0) price = applyDiscount(list, pct);
      }
      const comparePrice = null;

      return {
        id: p.id,
        name: p.name,
        href: `/produtos/${p.slug}`,
        category: p.category?.slug ?? "outros",
        brand: p.brand?.name ?? undefined,
        sku: p.sku,
        image: parseImages(p.images)[0],
        price,
        comparePrice,
        quoteOnly: p.quoteOnly,
        cart: pricesVisible && !p.quoteOnly && price ? { sku: p.sku, name: p.name, price } : undefined,
      };
    });
    const categories: CatalogCategory[] = [...catMap].map(([slug, label]) => ({ slug, label }));
    return { categories, items };
  } catch {
    return { categories: [], items: [] };
  }
}

export async function ProductsPage() {
  const customer = await getCustomer();
  const pricesVisible = !!customer;
  const discountCtx = await loadCustomerDiscountContext(customer?.id ?? null);
  const { categories, items } = await load(pricesVisible, discountCtx);
  return (
    <Catalog
      eyebrow="— Catálogo"
      allLabel="Todos"
      categories={categories}
      items={items}
      searchable
      pageSize={8}
      pricesVisible={pricesVisible}
    />
  );
}
