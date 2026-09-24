import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Newspaper, Pencil, Languages } from "lucide-react";
import { db } from "@/lib/db";
import { deleteNews } from "@/app/actions/admin-news";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Notícias" };

async function getNews() {
  try {
    return await db.news.findMany({ orderBy: { date: "desc" } });
  } catch {
    return [];
  }
}

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminNoticiasPage() {
  const news = await getNews();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Notícias</h1>
          <p className="text-sm text-gray-500 mt-0.5">{news.length} notícia{news.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/gmp-panel-admin/noticias/nova" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
          <Plus className="h-4 w-4" /> Nova notícia
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <Newspaper className="h-8 w-8 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm mb-6">Ainda não há notícias na base de dados.</p>
          <Link href="/gmp-panel-admin/noticias/nova" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
            <Plus className="h-4 w-4" /> Criar a primeira notícia
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-semibold">Título</th>
                <th className="px-5 py-3 font-semibold">Categoria</th>
                <th className="px-5 py-3 font-semibold">Data</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Acções</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{n.title}</td>
                  <td className="px-5 py-3 text-gray-500">{n.category}</td>
                  <td className="px-5 py-3 text-gray-500">{fmtDate(n.date)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${n.isPublished ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {n.isPublished ? "Publicada" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/gmp-panel-admin/noticias/${n.id}`} title="Editar" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link href={`/gmp-panel-admin/traducoes/news/${n.id}`} title="Traduções EN/FR" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
                        <Languages className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteNews} id={n.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
