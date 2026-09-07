import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { Catalog, type CatalogCategory, type CatalogItem } from "@/components/pages/catalog";

async function load(): Promise<{ categories: CatalogCategory[]; items: CatalogItem[] }> {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: { category: true, brand: true },
      orderBy: { createdAt: "asc" },
    });

    const catMap = new Map<string, string>();
    const items: CatalogItem[] = products.map((p) => {
      if (p.category) catMap.set(p.category.slug, p.category.name);
      const price = p.quoteOnly ? null : p.price;
      return {
        id: p.id,
        name: p.name,
        href: `/produtos/${p.slug}`,
        category: p.category?.slug ?? "outros",
        brand: p.brand?.name ?? undefined,
        sku: p.sku,
        image: parseImages(p.images)[0],
        price,
        comparePrice: p.comparePrice,
        quoteOnly: p.quoteOnly,
        cart: !p.quoteOnly && price ? { sku: p.sku, name: p.name, price } : undefined,
      };
    });
    const categories: CatalogCategory[] = [...catMap].map(([slug, label]) => ({ slug, label }));
    return { categories, items };
  } catch {
    return { categories: [], items: [] };
  }
}

export async function ProductsPage() {
  const { categories, items } = await load();
  return <Catalog eyebrow="— Catálogo" allLabel="Todos" categories={categories} items={items} searchable pageSize={8} />;
}
