"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TRANSLATABLE, ENTITY_REVALIDATE, isEntity, type Entity, type FieldType } from "@/lib/translatable";

type Target = "en" | "fr";

// ---------------------------------------------------------------------------
// MyMemory free translation API (no key required).
// ---------------------------------------------------------------------------
const MAX_SEG = 450; // MyMemory anonymous per-request limit is ~500 bytes

function splitLong(text: string): string[] {
  if (text.length <= MAX_SEG) return [text];
  // split on sentence boundaries, greedily packing up to MAX_SEG
  const parts = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + " " + p).trim().length > MAX_SEG) {
      if (cur) chunks.push(cur.trim());
      cur = p.length > MAX_SEG ? p.slice(0, MAX_SEG) : p;
    } else {
      cur = cur ? `${cur} ${p}` : p;
    }
  }
  if (cur) chunks.push(cur.trim());
  return chunks;
}

async function translateSegment(text: string, target: Target): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const chunks = splitLong(trimmed);
  const out: string[] = [];
  for (const chunk of chunks) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent(`pt|${target}`)}`;
    const res = await fetch(url, { headers: { "User-Agent": "GMPTools/1.0" }, cache: "no-store" });
    if (!res.ok) throw new Error(`translation service error (${res.status})`);
    const data = (await res.json()) as {
      responseStatus?: number | string;
      responseData?: { translatedText?: string };
      responseDetails?: string;
    };
    const status = Number(data.responseStatus);
    const translated = data.responseData?.translatedText;
    if (status !== 200 || !translated) {
      throw new Error(data.responseDetails || "translation service unavailable");
    }
    // MyMemory sometimes echoes an all-caps warning when the daily quota is hit
    if (/MYMEMORY WARNING|QUOTA|LIMIT/i.test(translated)) {
      throw new Error("Limite diário de tradução atingido. Tente novamente amanhã ou traduza manualmente.");
    }
    out.push(translated);
  }
  // preserve original leading/trailing whitespace of the line
  const joined = out.join(" ");
  return text.replace(trimmed, joined);
}

// Translate a whole raw field value according to its structural type.
async function translateField(type: FieldType, raw: string, target: Target): Promise<string> {
  if (!raw || !raw.trim()) return raw;
  switch (type) {
    case "text":
      return translateSegment(raw, target);
    case "textarea": {
      // translate line by line, preserving blank lines / paragraph breaks
      const lines = raw.split("\n");
      const out: string[] = [];
      for (const line of lines) {
        out.push(line.trim() ? await translateSegment(line, target) : line);
      }
      return out.join("\n");
    }
    case "list":
    case "lines": {
      let arr: string[];
      try {
        arr = JSON.parse(raw);
      } catch {
        return translateSegment(raw, target);
      }
      if (!Array.isArray(arr)) return raw;
      const out: string[] = [];
      for (const item of arr) out.push(typeof item === "string" ? await translateSegment(item, target) : item);
      return JSON.stringify(out);
    }
    case "specs": {
      let arr: { key: string; value: string }[];
      try {
        arr = JSON.parse(raw);
      } catch {
        return raw;
      }
      if (!Array.isArray(arr)) return raw;
      const out: { key: string; value: string }[] = [];
      for (const s of arr) {
        out.push({
          key: s.key ? await translateSegment(s.key, target) : s.key,
          value: s.value ? await translateSegment(s.value, target) : s.value,
        });
      }
      return JSON.stringify(out);
    }
  }
}

// ---------------------------------------------------------------------------
// Actions used by the admin translations editor.
// ---------------------------------------------------------------------------

/** Auto-translate the given PT raw values into the target locale. */
export async function autoTranslate(
  entity: string,
  ptValues: Record<string, string>,
  target: Target,
): Promise<{ success: true; values: Record<string, string> } | { success: false; error: string }> {
  if (!isEntity(entity)) return { success: false, error: "Entidade inválida." };
  if (target !== "en" && target !== "fr") return { success: false, error: "Idioma inválido." };
  try {
    const fields = TRANSLATABLE[entity];
    const values: Record<string, string> = {};
    for (const f of fields) {
      const raw = ptValues[f.field] ?? "";
      values[f.field] = raw.trim() ? await translateField(f.type, raw, target) : "";
    }
    return { success: true, values };
  } catch (e) {
    return { success: false, error: (e as Error)?.message || "Erro ao traduzir." };
  }
}

/** Persist reviewed translations. Empty values delete the stored row. */
export async function saveTranslations(
  entity: string,
  entityId: string,
  payload: { en?: Record<string, string>; fr?: Record<string, string> },
): Promise<{ success: boolean; error?: string }> {
  if (!isEntity(entity)) return { success: false, error: "Entidade inválida." };
  try {
    const fields = TRANSLATABLE[entity].map((f) => f.field);
    for (const locale of ["en", "fr"] as const) {
      const vals = payload[locale] ?? {};
      for (const field of fields) {
        const value = (vals[field] ?? "").trim();
        if (value) {
          await db.translation.upsert({
            where: { entity_entityId_field_locale: { entity, entityId, field, locale } },
            update: { value },
            create: { entity, entityId, field, locale, value },
          });
        } else {
          await db.translation
            .delete({ where: { entity_entityId_field_locale: { entity, entityId, field, locale } } })
            .catch(() => {});
        }
      }
    }
    for (const path of ENTITY_REVALIDATE[entity as Entity]) revalidatePath(path);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao guardar as traduções." };
  }
}
