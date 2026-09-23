import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { TRANSLATABLE, ENTITY_LABEL, isEntity, type Entity } from "@/lib/translatable";

export const metadata: Metadata = { title: "Traduções" };

const BACK: Record<Entity, string> = {
  product: "/gmp-panel-admin/produtos",
  machine: "/gmp-panel-admin/maquinas",
  news: "/gmp-panel-admin/noticias",
  category: "/gmp-panel-admin/categorias",
};

async function loadRow(entity: Entity, id: string): Promise<Record<string, unknown> | null> {
  try {
    switch (entity) {
      case "product":
        return await db.product.findUnique({ where: { id } });
      case "machine":
        return await db.machine.findUnique({ where: { id } });
      case "news":
        return await db.news.findUnique({ where: { id } });
      case "category":
        return await db.category.findUnique({ where: { id } });
    }
  } catch {
    return null;
  }
}

export default async function TraducoesPage({ params }: { params: Promise<{ entity: string; id: string }> }) {
  const { entity, id } = await params;
  if (!isEntity(entity)) notFound();

  const row = await loadRow(entity, id);
  if (!row) notFound();

  const fields = TRANSLATABLE[entity];

  // raw PT values straight from the columns (JSON for specs/materials, plain otherwise)
  const pt: Record<string, string> = {};
  for (const f of fields) {
    const v = row[f.field];
    pt[f.field] = typeof v === "string" ? v : v == null ? "" : String(v);
  }

  // existing stored en/fr translations
  const stored = await db.translation.findMany({ where: { entity, entityId: id } }).catch(() => []);
  const initial = { en: {} as Record<string, string>, fr: {} as Record<string, string> };
  for (const r of stored) {
    if (r.locale === "en" || r.locale === "fr") initial[r.locale][r.field] = r.value;
  }

  const title = typeof row.name === "string" ? row.name : typeof row.title === "string" ? row.title : id;

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Traduções · {ENTITY_LABEL[entity]}</h1>
      <p className="text-sm text-gray-500 mb-8">{title}</p>
      <TranslationsEditor entity={entity} entityId={id} fields={fields} pt={pt} initial={initial} backHref={BACK[entity]} />
    </div>
  );
}
