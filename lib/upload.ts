import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Saves uploaded image files to /public/uploads and returns their public URLs.
 * Empty file inputs (size 0) are ignored.
 */
export async function saveImages(files: File[]): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type.startsWith("image/")) continue;
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), buffer);
    urls.push(`/uploads/${name}`);
  }
  return urls;
}

const DOC_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods"];

/**
 * Saves a single uploaded document (e.g. a technical datasheet) to /public/uploads
 * and returns its public URL. Returns null for empty/invalid files.
 */
export async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const rawExt = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const isDoc = DOC_EXTS.includes(rawExt);
  const isPdfType = file.type === "application/pdf";
  if (!isDoc && !isPdfType) return null;
  const ext = rawExt || "pdf";
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `ficha-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

export function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
