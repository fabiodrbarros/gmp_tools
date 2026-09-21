import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone, Mail, FileDown } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { AddToCart } from "@/components/forms/add-to-cart";
import { SITE, SHOP_ENABLED } from "@/lib/site";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";

interface Spec { key: string; value: string; }
interface ViewProduct {
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number | null;
  comparePrice: number | null;
  shortDescription: string;
  description: string;
  specs: Spec[];
  materials: string[];
  images: string[];
  datasheet: string | null;
}

function parseList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map(String);
  } catch { /* not JSON */ }
  return raw.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
}

function parseSpecs(raw: string | null | undefined): Spec[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.filter((x) => x && x.key).map((x) => ({ key: String(x.key), value: String(x.value ?? "") }));
  } catch { /* not JSON */ }
  return [];
}

async function getProduct(slug: string): Promise<ViewProduct | null> {
  try {
    const p = await db.product.findFirst({
      where: { OR: [{ slug }, { sku: slug.toUpperCase() }], isActive: true },
      include: { category: true, brand: true },
    });
    if (!p) return null;
    return {
      name: p.name,
      sku: p.sku,
      brand: p.brand?.name ?? "GMP Tools",
      category: p.category?.name ?? "Catálogo",
      price: p.quoteOnly ? null : p.price,
      comparePrice: p.comparePrice,
      shortDescription: p.shortDescription ?? "",
      description: p.description ?? "",
      specs: parseSpecs(p.specifications),
      materials: parseList(p.materials),
      images: parseImages(p.images),
      datasheet: p.datasheet ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Produto não encontrado" };
  return { title: p.name, description: p.shortDescription || undefined };
}

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/produtos" className="hover:text-black transition-colors">Produtos</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">{p.sku}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center relative overflow-hidden">
              {p.images[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.images[0]} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <svg viewBox="0 0 200 200" className="h-48 w-48 text-gray-200" fill="none">
                  <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="3" />
                  <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="3" />
                  {[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5].map((a, i) => (
                    <line key={i}
                      x1={100 + 26 * Math.cos(a * Math.PI / 180)}
                      y1={100 + 26 * Math.sin(a * Math.PI / 180)}
                      x2={100 + 80 * Math.cos(a * Math.PI / 180)}
                      y2={100 + 80 * Math.sin(a * Math.PI / 180)}
                      stroke="currentColor" strokeWidth="2"
                    />
                  ))}
                </svg>
              )}
            </div>
            {p.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {p.images.slice(1, 5).map((src) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={src} src={src} alt={p.name} className="aspect-square w-full object-cover border border-gray-100" />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="text-xs font-medium tracking-widest text-red-600 uppercase mb-2">{p.brand} · {p.sku}</div>
            <h1 className="text-3xl font-medium text-black leading-tight mb-4">{p.name}</h1>
            {p.shortDescription && <p className="text-gray-500 leading-relaxed mb-8">{p.shortDescription}</p>}

            {/* Price */}
            {p.price != null ? (
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-medium text-black">{fmt(p.price)}</span>
                {p.comparePrice && p.comparePrice > p.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{fmt(p.comparePrice)}</span>
                    <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5">
                      -{Math.round((1 - p.price / p.comparePrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="text-2xl font-medium text-black mb-8">Sob consulta</div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-10">
              {SHOP_ENABLED && p.price != null && <AddToCart sku={p.sku} name={p.name} price={p.price} />}
              <QuoteForm productName={p.name} productSku={p.sku} />
              {p.datasheet && (
                <a
                  href={p.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 text-black text-sm font-semibold py-3.5 hover:border-black transition-colors"
                >
                  <FileDown className="h-4 w-4" /> Ficha técnica (PDF)
                </a>
              )}
            </div>

            {/* Tags */}
            {p.materials.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.materials.map((m) => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 font-medium">{m}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Specs & Description */}
        {(p.specs.length > 0 || p.description) && (
          <div className="mt-20 grid lg:grid-cols-2 gap-16 border-t border-gray-100 pt-16">
            {/* Specs */}
            {p.specs.length > 0 && (
              <div>
                <h2 className="text-xl font-medium mb-6">Especificações técnicas</h2>
                <div className="divide-y divide-gray-100">
                  {p.specs.map((s) => (
                    <div key={s.key} className="flex justify-between py-3 text-sm">
                      <span className="text-gray-500">{s.key}</span>
                      <span className="font-semibold text-black">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className={p.specs.length === 0 ? "lg:col-span-2 max-w-2xl" : ""}>
              {p.description && (
                <>
                  <h2 className="text-xl font-medium mb-6">Descrição</h2>
                  <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line">{p.description}</div>
                </>
              )}
              <div className="mt-8 p-5 bg-gray-50 border-l-2 border-red-600">
                <div className="flex items-center gap-2 text-sm font-medium text-black mb-1">
                  <Phone className="h-4 w-4 text-red-600" />
                  Precisa de ajuda na escolha?
                </div>
                <p className="text-xs text-gray-500 mb-4">Fale connosco e ajudamos a encontrar a solução certa para o seu trabalho.</p>
                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${SITE.phoneHref}`} className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors">
                    <Phone className="h-4 w-4" /> Ligar {SITE.phone}
                  </a>
                  <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 border border-gray-300 text-black text-sm font-semibold px-5 py-2.5 hover:border-black transition-colors">
                    <Mail className="h-4 w-4" /> Enviar mensagem
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
