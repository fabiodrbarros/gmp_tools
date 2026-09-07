import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { NewsForm } from "@/components/admin/news-form";

export const metadata: Metadata = { title: "Editar notícia" };

export default async function EditNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await db.news.findUnique({ where: { id } }).catch(() => null);
  if (!n) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Editar notícia</h1>
      <p className="text-sm text-gray-500 mb-8">{n.title}</p>
      <NewsForm
        news={{
          id: n.id,
          title: n.title,
          category: n.category,
          excerpt: n.excerpt,
          body: n.body ?? "",
          date: new Date(n.date).toISOString().slice(0, 10),
          readMin: n.readMin,
          images: parseImages(n.images),
          isPublished: n.isPublished,
        }}
      />
    </div>
  );
}
