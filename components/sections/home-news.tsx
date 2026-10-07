import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listArticles, formatDate } from "@/lib/news";
import { getT } from "@/lib/i18n-server";

export async function HomeNews() {
  const articles = await listArticles();
  if (articles.length === 0) return null;
  const { t } = await getT();
  const [featured, ...rest] = articles;
  const others = rest.slice(0, 3);

  return (
    <section className="bg-[#fafafa] py-24 lg:py-28 border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <h2 className="font-display uppercase font-medium text-black tracking-tight leading-[0.95] text-[clamp(2rem,4.5vw,3.5rem)]">
            {t("news.title")}
          </h2>
          <Link href="/noticias" className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            {t("news.all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10">
          {/* Featured — most recent */}
          <Link href={`/noticias/${featured.slug}`} className="group flex flex-col bg-white border border-gray-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center relative overflow-hidden">
              {featured.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <svg width="80" height="80" viewBox="0 0 32 32" aria-hidden>
                  <path d="M16 3L29 16L16 29L3 16Z" fill="#0a0a0a" opacity="0.06" />
                  <path d="M16 9L23 16L16 23L9 16Z" fill="#d3192b" opacity="0.12" />
                </svg>
              )}
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-medium px-2 py-1 uppercase tracking-wider">{featured.category}</span>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                <span>{formatDate(featured.date)}</span>
                <span className="h-px w-3 bg-gray-200" />
                <span>{featured.readMin} min</span>
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-medium text-black leading-tight tracking-tight mb-4 group-hover:text-red-600 transition-colors">
                {featured.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{featured.excerpt}</p>
            </div>
          </Link>

          {/* Others — smaller, beside */}
          <div className="flex flex-col divide-y divide-gray-200 border border-gray-100 bg-white">
            {others.map((a) => (
              <Link key={a.slug} href={`/noticias/${a.slug}`} className="group flex gap-4 p-5 hover:bg-gray-50 transition-colors">
                <div className="h-16 w-16 shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {a.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                      <path d="M16 3L29 16L16 29L3 16Z" fill="#0a0a0a" opacity="0.06" />
                      <path d="M16 9L23 16L16 23L9 16Z" fill="#d3192b" opacity="0.14" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[9px] text-gray-400 uppercase tracking-widest mb-1.5">
                    <span className="text-red-600 font-medium">{a.category}</span>
                    <span>· {formatDate(a.date)}</span>
                  </div>
                  <h3 className="font-display text-[15px] font-medium text-black leading-snug tracking-tight group-hover:text-red-600 transition-colors">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
