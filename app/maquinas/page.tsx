import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { Catalog, type CatalogCategory, type CatalogItem } from "@/components/pages/catalog";
import { getT, getLocale } from "@/lib/i18n-server";
import { localize } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Máquinas",
  description: "Máquinas e equipamento CNC para transformação de granitos, mármores, quartzo e cerâmicos. Várias marcas, venda, instalação e assistência técnica.",
};

const DEMO: CatalogItem[] = [
  { id: "1", name: "Ponteadora Automática", href: "/maquinas/ponteadora", category: "ponteadoras", brand: "—", quoteOnly: true, price: null },
];

async function load(): Promise<{ categories: CatalogCategory[]; items: CatalogItem[] }> {
  try {
    const locale = await getLocale();
    const [rawRows, rawCats] = await Promise.all([
      db.machine.findMany({
        where: { isActive: true, condition: "NEW" },
        include: { brand: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
      }),
      db.category.findMany({ where: { kind: "MACHINE" }, orderBy: { name: "asc" } }),
    ]);
    if (rawRows.length === 0) return { categories: [], items: DEMO };
    const [rows, cats] = await Promise.all([localize("machine", rawRows, locale), localize("category", rawCats, locale)]);

    const labelOf = new Map(cats.map((c) => [c.slug, c.name]));
    const used = new Set<string>();
    const items: CatalogItem[] = rows.map((m) => {
      if (m.category) used.add(m.category);
      return {
        id: m.id,
        name: m.name,
        href: `/maquinas/${m.slug}`,
        category: m.category ?? "outras",
        brand: m.brand?.name ?? undefined,
        image: parseImages(m.images)[0],
        price: null,
        quoteOnly: true,
      };
    });
    // Only show categories that actually have machines
    const categories: CatalogCategory[] = cats
      .filter((c) => used.has(c.slug))
      .map((c) => ({ slug: c.slug, label: c.name }));
    return { categories, items };
  } catch {
    return { categories: [], items: DEMO };
  }
}

export default async function MaquinasPage() {
  const { categories, items } = await load();
  const { t } = await getT();
  return (
    <>
      <Catalog eyebrow={t("cat.eyebrowNew")} allLabel={t("cat.allMachines")} categories={categories} items={items} searchable pageSize={9} />

      {/* CTA — não encontra a máquina? */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-20">
        <div className="bg-[#0a0a0a] p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-medium text-white mb-2">{t("machn.ctaTitle")}</h3>
            <p className="text-gray-400">{t("machn.ctaBody")}</p>
          </div>
          <Link href="/contactos" className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-7 py-3.5 hover:bg-red-700 transition-colors group shrink-0">
            {t("machn.ctaButton")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </>
  );
}
