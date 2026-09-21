"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { saveImages, saveFile } from "@/lib/upload";

async function collectImages(formData: FormData): Promise<string | null> {
  const kept = formData.getAll("existingImages").filter((v): v is string => typeof v === "string");
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  const uploaded = await saveImages(files);
  const all = [...kept, ...uploaded];
  return all.length ? JSON.stringify(all) : null;
}

// A new uploaded file replaces the existing one; otherwise keep the existing (unless removed).
async function collectDatasheet(formData: FormData): Promise<string | null> {
  const file = formData.get("datasheet");
  const uploaded = file instanceof File ? await saveFile(file) : null;
  if (uploaded) return uploaded;
  const kept = formData.get("existingDatasheet");
  return typeof kept === "string" && kept.trim() ? kept : null;
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveBrand(name?: string) {
  if (!name) return null;
  const slug = slugify(name);
  const b = await db.brand.upsert({ where: { slug }, update: {}, create: { name, slug } });
  return b.id;
}

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  label: z.string().optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  category: z.string().optional(),
  brand: z.string().optional(),
  year: z.string().optional(),
  price: z.number().nullable(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  specs: z.array(z.string()),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

function parse(formData: FormData) {
  const priceRaw = (formData.get("price") as string)?.trim();
  const specs = ((formData.get("specifications") as string) || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return schema.safeParse({
    name: ((formData.get("name") as string) || "").trim(),
    label: ((formData.get("label") as string) || "").trim() || undefined,
    condition: ((formData.get("condition") as string) || "NEW") as "NEW" | "USED" | "REFURBISHED",
    category: ((formData.get("category") as string) || "").trim() || undefined,
    brand: ((formData.get("brand") as string) || "").trim() || undefined,
    year: ((formData.get("year") as string) || "").trim() || undefined,
    price: priceRaw ? Number(priceRaw) : null,
    shortDescription: ((formData.get("shortDescription") as string) || "").trim() || undefined,
    description: ((formData.get("description") as string) || "").trim() || undefined,
    specs,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });
}

function buildData(m: z.infer<typeof schema>, brandId: string | null) {
  return {
    name: m.name,
    slug: slugify(m.name),
    label: m.label ?? null,
    condition: m.condition,
    category: m.category ?? null,
    year: m.year ?? null,
    price: m.price,
    shortDescription: m.shortDescription ?? null,
    description: m.description ?? null,
    specifications: m.specs.length ? JSON.stringify(m.specs) : null,
    isActive: m.isActive,
    isFeatured: m.isFeatured,
    brandId,
  };
}

function revalidate() {
  revalidatePath("/gmp-panel-admin/maquinas");
  revalidatePath("/maquinas");
  revalidatePath("/maquinas/usadas");
}

export async function createMachine(formData: FormData) {
  const parsed = parse(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  try {
    const brandId = await resolveBrand(parsed.data.brand);
    const images = await collectImages(formData);
    const datasheet = await collectDatasheet(formData);
    await db.machine.create({ data: { ...buildData(parsed.data, brandId), images, datasheet } });
    revalidate();
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) return { success: false, error: "Já existe uma máquina com este nome." };
    console.error(e);
    return { success: false, error: "Erro ao guardar a máquina." };
  }
}

export async function updateMachine(id: string, formData: FormData) {
  const parsed = parse(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  try {
    const brandId = await resolveBrand(parsed.data.brand);
    const images = await collectImages(formData);
    const datasheet = await collectDatasheet(formData);
    await db.machine.update({ where: { id }, data: { ...buildData(parsed.data, brandId), images, datasheet } });
    revalidate();
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) return { success: false, error: "Já existe uma máquina com este nome." };
    console.error(e);
    return { success: false, error: "Erro ao actualizar a máquina." };
  }
}

export async function deleteMachine(id: string) {
  try {
    await db.machine.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao apagar a máquina." };
  }
}
