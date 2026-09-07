import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";

async function getProducts() {
  try {
    return await db.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true, brand: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return DEMO_PRODUCTS;
  }
}

const DEMO_PRODUCTS = [
  { id: "1", name: "Disco Diamantado Granito Premium 350mm", sku: "DD-GR-350", price: 189.90, comparePrice: 219.90, quoteOnly: false, category: { name: "Discos Diamantados" }, brand: { name: "Distar" } },
  { id: "2", name: "Disco Diamantado Mármore 400mm", sku: "DD-MRM-400", price: 245.00, comparePrice: null, quoteOnly: false, category: { name: "Discos Diamantados" }, brand: { name: "Distar" } },
  { id: "3", name: "Fresa CNC Perfil Ogiva 20mm", sku: "FR-CNC-OG-20", price: 145.00, comparePrice: null, quoteOnly: false, category: { name: "Ferramentas CNC" }, brand: { name: "Alpha" } },
  { id: "4", name: "Frankfurt Resinada Mármore 140g", sku: "FR-MRM-140", price: 38.50, comparePrice: null, quoteOnly: false, category: { name: "Frankfurt" }, brand: { name: "Alpha" } },
  { id: "5", name: "Disco Cerâmica Turbo 230mm", sku: "DD-CER-230", price: 54.90, comparePrice: null, quoteOnly: false, category: { name: "Discos Diamantados" }, brand: { name: "Tyrolit" } },
  { id: "6", name: "Mó Polir CNC Granito D130", sku: "MO-CNC-GR-130", price: null, comparePrice: null, quoteOnly: true, category: { name: "Polimento" }, brand: { name: "Alpha" } },
] as const;

function formatPrice(n: number | null | undefined) {
  if (!n) return null;
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
}

export async function FeaturedProducts() {
  const products = await getProducts();

  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="text-xs font-medium tracking-[0.2em] text-red-600 uppercase mb-3">Em destaque</div>
            <h2 className="text-5xl font-medium text-black">Os mais procurados.</h2>
          </div>
          <Link href="/produtos" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            Catálogo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {(products as typeof DEMO_PRODUCTS).map((p) => (
            <Link
              key={p.id}
              href={`/produtos/${p.sku.toLowerCase()}`}
              className="bg-white group flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image area */}
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                <svg viewBox="0 0 120 90" className="h-16 w-auto text-gray-200" fill="none">
                  <circle cx="45" cy="45" r="35" stroke="currentColor" strokeWidth="2" />
                  <circle cx="45" cy="45" r="12" stroke="currentColor" strokeWidth="2" />
                  {[0,45,90,135,180,225,270,315].map((a, i) => (
                    <line key={i}
                      x1={45 + 13 * Math.cos(a * Math.PI/180)}
                      y1={45 + 13 * Math.sin(a * Math.PI/180)}
                      x2={45 + 35 * Math.cos(a * Math.PI/180)}
                      y2={45 + 35 * Math.sin(a * Math.PI/180)}
                      stroke="currentColor" strokeWidth="1.5"
                    />
                  ))}
                </svg>
                {p.comparePrice && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-medium px-2 py-0.5 tracking-wider">
                    -{Math.round((1 - p.price! / p.comparePrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
                  {p.category.name} · {p.brand.name}
                </div>
                <h3 className="text-sm font-medium text-black mb-4 leading-snug group-hover:text-red-600 transition-colors">
                  {p.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    {p.quoteOnly || !p.price ? (
                      <span className="text-xs text-gray-400 italic">Sob consulta</span>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-medium text-black">{formatPrice(p.price)}</span>
                        {p.comparePrice && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(p.comparePrice)}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
