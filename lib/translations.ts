import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n-dict";
import { TRANSLATABLE, type Entity } from "@/lib/translatable";

// entityId -> { field -> translated raw value }
export type TranslationMap = Map<string, Record<string, string>>;

/** Load stored translations for a set of entities in one query. PT returns empty. */
export async function loadTranslations(entity: Entity, ids: string[], locale: Locale): Promise<TranslationMap> {
  const map: TranslationMap = new Map();
  if (locale === "pt" || ids.length === 0) return map;
  try {
    const rows = await db.translation.findMany({ where: { entity, locale, entityId: { in: ids } } });
    for (const r of rows) {
      const cur = map.get(r.entityId) ?? {};
      if (r.value && r.value.trim()) cur[r.field] = r.value;
      map.set(r.entityId, cur);
    }
  } catch {
    /* translations are best-effort — fall back to PT source */
  }
  return map;
}

/**
 * Overlay translated raw field values onto a list of rows (in place of the PT
 * source) for the given locale. Missing fields fall back to the PT value.
 * Rows must carry `id` and the raw translatable fields (same names as the DB).
 */
export async function localize<T extends { id: string }>(entity: Entity, rows: T[], locale: Locale): Promise<T[]> {
  if (locale === "pt" || rows.length === 0) return rows;
  const map = await loadTranslations(entity, rows.map((r) => r.id), locale);
  if (map.size === 0) return rows;
  const fields = TRANSLATABLE[entity].map((f) => f.field);
  return rows.map((r) => {
    const tr = map.get(r.id);
    if (!tr) return r;
    const copy = { ...r } as Record<string, unknown>;
    for (const f of fields) if (tr[f]) copy[f] = tr[f];
    return copy as T;
  });
}

/** Overlay for a single row (or null). */
export async function localizeOne<T extends { id: string }>(entity: Entity, row: T | null, locale: Locale): Promise<T | null> {
  if (!row) return row;
  const [out] = await localize(entity, [row], locale);
  return out;
}
