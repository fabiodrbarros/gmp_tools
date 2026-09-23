// Central definition of which customer-facing fields are translatable, per entity.
// Pure data (no server imports) so both client forms and server code can use it.
// PT is always the source language; translations are stored only for en/fr.

export type Entity = "product" | "machine" | "news" | "category";

// How a field's raw stored value is shaped — controls how the editor renders it
// and how the auto-translate step segments the text.
//   text     -> single-line string
//   textarea -> multi-line string (paragraphs kept)
//   list     -> JSON array of strings, comma-separated in the editor (materials)
//   lines    -> JSON array of strings, one per line in the editor (machine specs)
//   specs    -> JSON array of { key, value } (product specifications)
export type FieldType = "text" | "textarea" | "list" | "lines" | "specs";

export interface TranslatableField {
  field: string;
  label: string;
  type: FieldType;
}

export const TRANSLATABLE: Record<Entity, TranslatableField[]> = {
  product: [
    { field: "name", label: "Nome", type: "text" },
    { field: "shortDescription", label: "Descrição curta", type: "text" },
    { field: "description", label: "Descrição", type: "textarea" },
    { field: "materials", label: "Materiais", type: "list" },
    { field: "specifications", label: "Especificações", type: "specs" },
  ],
  machine: [
    { field: "name", label: "Nome", type: "text" },
    { field: "shortDescription", label: "Descrição curta", type: "text" },
    { field: "description", label: "Descrição", type: "textarea" },
    { field: "specifications", label: "Especificações", type: "lines" },
  ],
  news: [
    { field: "title", label: "Título", type: "text" },
    { field: "category", label: "Categoria", type: "text" },
    { field: "excerpt", label: "Resumo", type: "textarea" },
    { field: "body", label: "Corpo do artigo", type: "textarea" },
  ],
  category: [{ field: "name", label: "Nome", type: "text" }],
};

export const ENTITIES: Entity[] = ["product", "machine", "news", "category"];

export function isEntity(v: string): v is Entity {
  return (ENTITIES as string[]).includes(v);
}

export const ENTITY_LABEL: Record<Entity, string> = {
  product: "Produto",
  machine: "Máquina",
  news: "Notícia",
  category: "Categoria",
};

// --- raw (stored) <-> display (friendly) conversion, matching how the PT admin
// forms present these fields, so reviewed translations store in the same format.

/** Stored raw value -> friendly editor text. */
export function rawToDisplay(type: FieldType, raw: string | null | undefined): string {
  const v = raw ?? "";
  if (!v) return "";
  if (type === "list") {
    try {
      const j = JSON.parse(v);
      if (Array.isArray(j)) return j.map(String).join(", ");
    } catch {}
    return v.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean).join(", ");
  }
  if (type === "lines") {
    try {
      const j = JSON.parse(v);
      if (Array.isArray(j)) return j.map(String).join("\n");
    } catch {}
    return v.split("\n").map((s) => s.trim()).filter(Boolean).join("\n");
  }
  if (type === "specs") {
    try {
      const j = JSON.parse(v);
      if (Array.isArray(j)) return j.map((s) => `${s.key}: ${s.value ?? ""}`).join("\n");
    } catch {}
    return "";
  }
  return v;
}

/** Friendly editor text -> stored raw value (JSON for list/specs). */
export function displayToRaw(type: FieldType, display: string): string {
  const v = (display ?? "").trim();
  if (!v) return "";
  if (type === "list") {
    const arr = v.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    return arr.length ? JSON.stringify(arr) : "";
  }
  if (type === "lines") {
    const arr = v.split("\n").map((s) => s.trim()).filter(Boolean);
    return arr.length ? JSON.stringify(arr) : "";
  }
  if (type === "specs") {
    const specs = v
      .split("\n")
      .map((line) => {
        const idx = line.indexOf(":");
        if (idx === -1) return null;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        return key ? { key, value } : null;
      })
      .filter((x): x is { key: string; value: string } => x !== null);
    return specs.length ? JSON.stringify(specs) : "";
  }
  return v;
}

// The public-facing route base that must be revalidated when a translation changes.
export const ENTITY_REVALIDATE: Record<Entity, string[]> = {
  product: ["/produtos", "/"],
  machine: ["/maquinas", "/maquinas/usadas", "/"],
  news: ["/noticias", "/"],
  category: ["/produtos", "/maquinas", "/maquinas/usadas"],
};
