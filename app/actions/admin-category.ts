"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidate() {
  revalidatePath("/gmp-panel-admin/categorias");
  revalidatePath("/produtos");
  revalidatePath("/maquinas");
}

export async function createCategory(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim();
  const kind = ((formData.get("kind") as string) || "PRODUCT") === "MACHINE" ? "MACHINE" : "PRODUCT";
  if (name.length < 2) return { success: false, error: "Nome obrigatório." };

  // Make the slug unique per name; machine/product can share visually but slugs are global
  const base = slugify(name) || "categoria";
  let slug = base;
  for (let i = 2; await db.category.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;

  try {
    await db.category.create({ data: { name, slug, kind } });
    revalidate();
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao criar a categoria." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Não foi possível apagar (pode ter produtos associados)." };
  }
}
