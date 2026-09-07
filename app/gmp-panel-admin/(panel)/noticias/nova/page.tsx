import type { Metadata } from "next";
import { NewsForm } from "@/components/admin/news-form";

export const metadata: Metadata = { title: "Nova notícia" };

export default function NovaNoticiaPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-1">Nova notícia</h1>
      <p className="text-sm text-gray-500 mb-8">Publique uma notícia ou guia técnico.</p>
      <NewsForm />
    </div>
  );
}
