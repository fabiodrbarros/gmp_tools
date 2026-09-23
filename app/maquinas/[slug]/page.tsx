import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, Check, FileDown } from "lucide-react";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";
import { Gallery } from "@/components/gallery";
import { QuoteForm } from "@/components/forms/quote-form";
import { SITE } from "@/lib/site";
import { getCustomer } from "@/lib/customer-auth";
import { getT, getLocale } from "@/lib/i18n-server";
import { localizeOne } from "@/lib/translations";

const COND_CLS: Record<string, string> = {
  NEW: "bg-green-50 text-green-600",
  REFURBISHED: "bg-blue-50 text-blue-600",
  USED: "bg-gray-100 text-gray-500",
};

function parseSpecs(raw: string | null): string[] {
  if (!raw) return [];
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v.map(String) : []; } catch { return []; }
}

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

async function getMachine(slug: string) {
  try {
    return await db.machine.findUnique({ where: { slug }, include: { brand: true } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMachine(slug);
  if (!m) return { title: "Máquina" };
  return { title: m.name, description: m.shortDescription ?? undefined };
}

export default async function MachinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await getMachine(slug);
  if (!raw) notFound();

  const { t, locale } = await getT();
  const m = (await localizeOne("machine", raw, locale))!;
  const specs = parseSpecs(m.specifications);
  const images = parseImages(m.images);
  const cond = { label: t(`md.cond${m.condition}`), cls: COND_CLS[m.condition] ?? COND_CLS.NEW };
  const used = m.condition !== "NEW";
  const pricesVisible = !!(await getCustomer());

  // Meta rows (only the ones that exist)
  const meta: { k: string; v: string }[] = [
    m.brand?.name ? { k: t("md.brand"), v: m.brand.name } : null,
    m.label ? { k: t("md.type"), v: m.label } : null,
    { k: t("md.state"), v: cond.label },
    m.year ? { k: t("md.year"), v: m.year } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">{t("pd.home")}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={used ? "/maquinas/usadas" : "/maquinas"} className="hover:text-black transition-colors">
            {used ? t("md.usedMachines") : t("md.machines")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">{m.name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Visual — gallery */}
          <div className="lg:sticky lg:top-24 self-start">
            {images.length > 0 ? (
              <Gallery images={images} alt={m.name} />
            ) : (
              <div className="aspect-[4/3] bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-[11px] font-medium tracking-widest text-gray-300 uppercase mb-1">{m.brand?.name}</div>
                  <div className="font-display text-6xl font-medium text-gray-200">{m.year ?? m.name.split(" ").slice(-1)}</div>
                </div>
                <span className={`absolute top-4 left-4 text-[10px] font-medium uppercase px-2.5 py-1 tracking-widest ${cond.cls}`}>{cond.label}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {m.label && <div className="text-[11px] font-medium tracking-widest text-red-600 uppercase mb-3">{m.label}</div>}
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-black tracking-tight mb-3">{m.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[10px] font-medium uppercase px-2 py-1 tracking-widest ${cond.cls}`}>{cond.label}</span>
              <span className="text-3xl font-medium text-black">
                {pricesVisible && m.price != null ? <>{fmt(m.price)}<span className="text-gray-400 font-normal text-base ml-1">+ IVA</span></> : t("pd.quote")}
              </span>
            </div>

            {(m.description || m.shortDescription) && (
              <p className="text-gray-500 leading-relaxed mb-8">{m.description || m.shortDescription}</p>
            )}

            {/* Ficha técnica */}
            <div className="border border-gray-100 divide-y divide-gray-100 mb-8">
              {meta.map((row) => (
                <div key={row.k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-gray-400">{row.k}</span>
                  <span className="text-gray-900 font-medium text-right">{row.v}</span>
                </div>
              ))}
            </div>

            {/* Características */}
            {specs.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-4">{t("md.features")}</h2>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {specs.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-red-600 shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ficha técnica (ficheiro) */}
            {m.datasheet && (
              <a
                href={m.datasheet}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-200 text-black text-sm font-semibold px-5 py-3 mb-10 hover:border-black transition-colors"
              >
                <FileDown className="h-4 w-4" /> {t("pd.datasheet")}
              </a>
            )}

            {/* Quote */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-1">{t("md.interested")}</h2>
              <p className="text-sm text-gray-400 mb-5">{t("md.interestedBody")}</p>
              <QuoteForm productName={`${m.name}${m.year ? ` (${m.year})` : ""}`} productSku={`MAQ-${m.id.slice(-6).toUpperCase()}`} />
            </div>

            <a href={`tel:${SITE.phoneHref}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
              {t("md.callUs")} {SITE.phone} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
