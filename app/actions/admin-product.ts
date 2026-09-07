"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { saveImages } from "@/lib/upload";

async function collectImages(formData: FormData): Promise<string | null> {
  const kept = formData.getAll("existingImages").filter((v): v is string => typeof v === "string");
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  const uploaded = await saveImages(files);
  const all = [...kept, ...uploaded];
  return all.length ? JSON.stringify(all) : null;
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "Chave: Valor" per line -> JSON array of {key, value}
function buildSpecs(raw: string): string | null {
  const specs = raw
    .split("\n")
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return null;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      return key ? { key, value } : null;
    })
    .filter((x): x is { key: string; value: string } => x !== null);
  return specs.length ? JSON.stringify(specs) : null;
}

// comma / newline separated -> JSON array of strings
function buildList(raw: string): string | null {
  const arr = raw.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  return arr.length ? JSON.stringify(arr) : null;
}

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  sku: z.string().min(1, "SKU obrigatório"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nullable(),
  comparePrice: z.number().nullable(),
  stock: z.number().int(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  quoteOnly: z.boolean(),
});

export async function createProduct(formData: FormData) {
  const num = (v: FormDataEntryValue | null) => {
    const s = (v as string)?.trim();
    return s ? Number(s) : null;
  };

  const data = {
    name: ((formData.get("name") as string) || "").trim(),
    sku: ((formData.get("sku") as string) || "").trim(),
    shortDescription: ((formData.get("shortDescription") as string) || "").trim() || undefined,
    description: ((formData.get("description") as string) || "").trim() || undefined,
    price: num(formData.get("price")),
    comparePrice: num(formData.get("comparePrice")),
    stock: Number((formData.get("stock") as string) || "0") || 0,
    category: ((formData.get("category") as string) || "").trim() || undefined,
    brand: ((formData.get("brand") as string) || "").trim() || undefined,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    quoteOnly: formData.get("quoteOnly") === "on",
  };

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const p = parsed.data;

  try {
    // Resolve / create category and brand by name
    let categoryId: string | null = null;
    if (p.category) {
      const slug = slugify(p.category);
      const cat = await db.category.upsert({
        where: { slug },
        update: {},
        create: { name: p.category, slug },
      });
      categoryId = cat.id;
    }

    let brandId: string | null = null;
    if (p.brand) {
      const slug = slugify(p.brand);
      const brand = await db.brand.upsert({
        where: { slug },
        update: {},
        create: { name: p.brand, slug },
      });
      brandId = brand.id;
    }

    const images = await collectImages(formData);
    const specifications = buildSpecs((formData.get("specs") as string) || "");
    const materials = buildList((formData.get("materials") as string) || "");

    await db.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        sku: p.sku,
        shortDescription: p.shortDescription ?? null,
        description: p.description ?? null,
        price: p.quoteOnly ? null : p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        specifications,
        materials,
        images,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        quoteOnly: p.quoteOnly,
        categoryId,
        brandId,
      },
    });

    revalidatePath("/gmp-panel-admin/produtos");
    revalidatePath("/produtos");
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) {
      return { success: false, error: "Já existe um produto com este nome ou SKU." };
    }
    console.error(e);
    return { success: false, error: "Erro ao guardar o produto." };
  }
}

async function resolveRef(model: "category" | "brand", name?: string) {
  if (!name) return null;
  const slug = slugify(name);
  const rec = model === "category"
    ? await db.category.upsert({ where: { slug }, update: {}, create: { name, slug } })
    : await db.brand.upsert({ where: { slug }, update: {}, create: { name, slug } });
  return rec.id;
}

export async function updateProduct(id: string, formData: FormData) {
  const num = (v: FormDataEntryValue | null) => {
    const s = (v as string)?.trim();
    return s ? Number(s) : null;
  };

  const data = {
    name: ((formData.get("name") as string) || "").trim(),
    sku: ((formData.get("sku") as string) || "").trim(),
    shortDescription: ((formData.get("shortDescription") as string) || "").trim() || undefined,
    description: ((formData.get("description") as string) || "").trim() || undefined,
    price: num(formData.get("price")),
    comparePrice: num(formData.get("comparePrice")),
    stock: Number((formData.get("stock") as string) || "0") || 0,
    category: ((formData.get("category") as string) || "").trim() || undefined,
    brand: ((formData.get("brand") as string) || "").trim() || undefined,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    quoteOnly: formData.get("quoteOnly") === "on",
  };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const p = parsed.data;

  try {
    const categoryId = await resolveRef("category", p.category);
    const brandId = await resolveRef("brand", p.brand);
    const images = await collectImages(formData);
    const specifications = buildSpecs((formData.get("specs") as string) || "");
    const materials = buildList((formData.get("materials") as string) || "");

    await db.product.update({
      where: { id },
      data: {
        name: p.name,
        slug: slugify(p.name),
        sku: p.sku,
        shortDescription: p.shortDescription ?? null,
        description: p.description ?? null,
        price: p.quoteOnly ? null : p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        specifications,
        materials,
        images,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        quoteOnly: p.quoteOnly,
        categoryId,
        brandId,
      },
    });

    revalidatePath("/gmp-panel-admin/produtos");
    revalidatePath("/produtos");
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) {
      return { success: false, error: "Já existe um produto com este nome ou SKU." };
    }
    console.error(e);
    return { success: false, error: "Erro ao actualizar o produto." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/gmp-panel-admin/produtos");
    revalidatePath("/produtos");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao apagar o produto." };
  }
}
