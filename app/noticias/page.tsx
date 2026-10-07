import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listArticles, formatDate } from "@/lib/news";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Notícias, guias técnicos e novidades da GMP Tools — ferramentas diamantadas, máquinas CNC e equipamento para a indústria dos granitos, mármores, quartzo e cerâmicos.",
};

export default async function NoticiasPage() {
  const articles = await listArticles();
  const [featured, ...rest] = articles;
  const { t } = await getT();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100 py-12 lg:py-14">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-black tracking-tight">{t("news.title")}</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {articles.length === 0 && (
          <p className="text-gray-400 text-sm">{t("news.none")}</p>
        )}
        {/* Featured */}
        {featured && (
        <Link href={`/noticias/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 pb-16 border-b border-gray-100">
          <div className="aspect-[16/10] bg-gray-50 border border-gray-100 flex items-center justify-center relative overflow-hidden">
            {featured.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <svg width="90" height="90" viewBox="0 0 32 32" aria-hidden>
                <path d="M16 3L29 16L16 29L3 16Z" fill="#0a0a0a" opacity="0.06" />
                <path d="M16 9L23 16L16 23L9 16Z" fill="#d3192b" opacity="0.12" />
              </svg>
            )}
            <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-medium px-2 py-1 uppercase tracking-wider">{featured.category}</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 text-[11px] text-gray-400 uppercase tracking-widest mb-4">
              <span>{formatDate(featured.date)}</span>
              <span className="h-px w-4 bg-gray-200" />
              <span>{featured.readMin} {t("news.readMinLong")}</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-medium text-black leading-tight tracking-tight mb-4 group-hover:text-red-600 transition-colors">
              {featured.title}
            </h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed mb-6">{featured.excerpt}</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-black group-hover:text-red-600 transition-colors">
              {t("news.readArticle")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/noticias/${a.slug}`}
              className="bg-white border border-gray-100 group flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[16/10] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {a.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <svg width="64" height="64" viewBox="0 0 32 32" aria-hidden>
                    <path d="M16 3L29 16L16 29L3 16Z" fill="#0a0a0a" opacity="0.06" />
                    <path d="M16 9L23 16L16 23L9 16Z" fill="#d3192b" opacity="0.12" />
                  </svg>
                )}
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-medium px-2 py-1 uppercase tracking-wider">{a.category}</span>
              </div>
              <div className="p-7 flex flex-col flex-1 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                  <span>{formatDate(a.date)}</span>
                  <span className="h-px w-3 bg-gray-200" />
                  <span>{a.readMin} {t("news.readMin")}</span>
                </div>
                <h3 className="font-display text-lg font-medium text-black leading-snug tracking-tight mb-4 group-hover:text-red-600 transition-colors">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light flex-1">{a.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-red-600 transition-colors mt-6 pt-5 border-t border-gray-50">
                  {t("news.readMore")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
