import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { Catalog, type CatalogCategory, type CatalogItem } from "@/components/pages/catalog";
import { getT, getLocale } from "@/lib/i18n-server";
import { localize } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Máquinas Usadas e Recondicionadas",
  description: "Máquinas usadas e recondicionadas para granitos, mármores, quartzo e cerâmicos. Equipamento testado e certificado, com garantia.",
};

const CATEGORIES: CatalogCategory[] = [
  { slug: "recondicionadas", label: "Recondicionadas" },
  { slug: "usadas", label: "Usadas" },
];

const DEMO: CatalogItem[] = [
  { id: "1", name: "Ponteadora Recondicionada", href: "/contactos", category: "recondicionadas", brand: "—", price: null, quoteOnly: true },
];

async function load(): Promise<CatalogItem[]> {
  try {
    const locale = await getLocale();
    const rawRows = await db.machine.findMany({
      where: { isActive: true, condition: { in: ["USED", "REFURBISHED"] } },
      include: { brand: true },
      orderBy: { createdAt: "asc" },
    });
    if (rawRows.length === 0) return DEMO;
    const rows = await localize("machine", rawRows, locale);
    return rows.map((m) => ({
      id: m.id,
      name: `${m.name}${m.year ? ` (${m.year})` : ""}`,
      href: `/maquinas/${m.slug}`,
      category: m.condition === "REFURBISHED" ? "recondicionadas" : "usadas",
      brand: m.brand?.name ?? undefined,
      badge: m.label ?? (m.condition === "REFURBISHED" ? "Recondicionada" : "Usada"),
      image: parseImages(m.images)[0],
      price: m.price,
      quoteOnly: m.price == null,
    }));
  } catch {
    return DEMO;
  }
}

export default async function UsedMachinesPage() {
  const items = await load();
  const { t } = await getT();

  return (
    <>
      <Catalog eyebrow={t("cat.eyebrowUsed")} allLabel={t("cat.allMachines")} categories={CATEGORIES} items={items} searchable pageSize={9} />

      {/* CTA */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-20">
        <div className="bg-red-600 p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-medium text-white mb-2">{t("machu.ctaTitle")}</h3>
              <p className="text-white/80">{t("machu.ctaBody")}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/maquinas" className="inline-flex items-center gap-2 border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/10 transition-colors">
                {t("machu.newBtn")}
              </Link>
              <Link href="/contactos" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-3 hover:bg-gray-900 transition-colors group">
                {t("machn.ctaButton")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
