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

const schema = z.object({
  title: z.string().min(2, "Título obrigatório"),
  category: z.string().min(1, "Categoria obrigatória"),
  excerpt: z.string().min(1, "Resumo obrigatório"),
  body: z.string().optional(),
  date: z.string().optional(),
  readMin: z.number().int().min(1),
  isPublished: z.boolean(),
});

function readForm(formData: FormData) {
  return {
    title: ((formData.get("title") as string) || "").trim(),
    category: ((formData.get("category") as string) || "").trim(),
    excerpt: ((formData.get("excerpt") as string) || "").trim(),
    body: ((formData.get("body") as string) || "").trim() || undefined,
    date: ((formData.get("date") as string) || "").trim() || undefined,
    readMin: Number((formData.get("readMin") as string) || "3") || 3,
    isPublished: formData.get("isPublished") === "on",
  };
}

function toDate(raw?: string): Date {
  if (!raw) return new Date();
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function createNews(formData: FormData) {
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const n = parsed.data;

  try {
    const images = await collectImages(formData);
    await db.news.create({
      data: {
        slug: slugify(n.title),
        title: n.title,
        category: n.category,
        excerpt: n.excerpt,
        body: n.body ?? null,
        date: toDate(n.date),
        readMin: n.readMin,
        images,
        isPublished: n.isPublished,
      },
    });
    revalidatePath("/gmp-panel-admin/noticias");
    revalidatePath("/noticias");
    revalidatePath("/");
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) {
      return { success: false, error: "Já existe uma notícia com este título." };
    }
    console.error(e);
    return { success: false, error: "Erro ao guardar a notícia." };
  }
}

export async function updateNews(id: string, formData: FormData) {
  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const n = parsed.data;

  try {
    const images = await collectImages(formData);
    await db.news.update({
      where: { id },
      data: {
        slug: slugify(n.title),
        title: n.title,
        category: n.category,
        excerpt: n.excerpt,
        body: n.body ?? null,
        date: toDate(n.date),
        readMin: n.readMin,
        images,
        isPublished: n.isPublished,
      },
    });
    revalidatePath("/gmp-panel-admin/noticias");
    revalidatePath("/noticias");
    revalidatePath("/");
    return { success: true };
  } catch (e: unknown) {
    const msg = String((e as Error)?.message ?? e);
    if (msg.includes("Unique") || msg.includes("constraint")) {
      return { success: false, error: "Já existe uma notícia com este título." };
    }
    console.error(e);
    return { success: false, error: "Erro ao actualizar a notícia." };
  }
}

export async function deleteNews(id: string) {
  try {
    await db.news.delete({ where: { id } });
    revalidatePath("/gmp-panel-admin/noticias");
    revalidatePath("/noticias");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao apagar a notícia." };
  }
}
