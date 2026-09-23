import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { listArticles, getArticle, formatDate } from "@/lib/news";
import { getT } from "@/lib/i18n-server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Notícia" };
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const { t } = await getT();

  const related = (await listArticles()).filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition-colors">{t("pd.home")}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/noticias" className="hover:text-black transition-colors">{t("nav.news")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 truncate">{article.title}</span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-red-600 text-white text-[10px] font-medium px-2 py-1 uppercase tracking-wider">{article.category}</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-widest">{formatDate(article.date)} · {article.readMin} {t("news.readMin")}</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl lg:text-5xl font-medium text-black leading-[1.05] tracking-tight mb-10">
          {article.title}
        </h1>

        {/* Cover */}
        <div className="aspect-[16/9] bg-gray-50 border border-gray-100 flex items-center justify-center mb-10 overflow-hidden">
          {article.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
          ) : (
            <svg width="100" height="100" viewBox="0 0 32 32" aria-hidden>
              <path d="M16 3L29 16L16 29L3 16Z" fill="#0a0a0a" opacity="0.06" />
              <path d="M16 9L23 16L16 23L9 16Z" fill="#1878b6" opacity="0.12" />
            </svg>
          )}
        </div>

        {/* Body */}
        <div className="space-y-6 text-[17px] text-gray-700 leading-relaxed">
          {article.body.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl text-black font-light leading-relaxed" : ""}>{p}</p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <Link href="/noticias" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t("news.allNews")}
          </Link>
          <Link href="/contactos" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-3 hover:bg-red-600 transition-colors group">
            {t("news.talkTeam")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </article>

      {/* Related */}
      <div className="border-t border-gray-100 bg-[#fafafa] py-16">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6">{t("news.continue")}</div>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((a) => (
              <Link key={a.slug} href={`/noticias/${a.slug}`} className="bg-white border border-gray-100 p-8 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                  <span className="text-red-600 font-semibold">{a.category}</span>
                  <span>· {formatDate(a.date)}</span>
                </div>
                <h3 className="font-display text-xl font-medium text-black leading-snug tracking-tight mb-2 group-hover:text-red-600 transition-colors">{a.title}</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
