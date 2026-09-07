"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SHOP_ENABLED } from "@/lib/site";

export interface CatalogCategory {
  slug: string;
  label: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  href: string;
  category: string;
  brand?: string;
  sku?: string;
  badge?: string;
  image?: string;
  price?: number | null;
  comparePrice?: number | null;
  quoteOnly?: boolean;
  cart?: { sku: string; name: string; price: number };
}

function fmt(n: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

interface CatalogProps {
  eyebrow?: string;
  title?: string;
  allLabel?: string;
  categories: CatalogCategory[];
  items: CatalogItem[];
  searchable?: boolean;
  pageSize?: number;
}

export function Catalog({ eyebrow, title, allLabel = "Todos", categories, items, searchable = false, pageSize }: CatalogProps) {
  const [cat, setCat] = React.useState("todos");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { add } = useCart();

  const q = search.trim().toLowerCase();
  const filtered = items.filter((i) => {
    const matchCat = cat === "todos" || i.category === cat;
    const matchSearch = !q || i.name.toLowerCase().includes(q) || (i.sku?.toLowerCase().includes(q) ?? false);
    return matchCat && matchSearch;
  });

  // Reset to first page whenever the filters change
  React.useEffect(() => { setPage(1); }, [cat, search]);

  const size = pageSize ?? (filtered.length || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, totalPages);
  const paged = pageSize ? filtered.slice((current - 1) * size, current * size) : filtered;

  const count = (slug: string) => (slug === "todos" ? items.length : items.filter((i) => i.category === slug).length);
  const cats: CatalogCategory[] = [{ slug: "todos", label: allLabel }, ...categories];

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="pt-12 lg:pt-14 pb-2">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          {eyebrow && (
            <div className={`font-semibold text-red-600 uppercase ${title ? "text-[11px] tracking-[0.25em] mb-3" : "text-base lg:text-lg tracking-[0.2em]"}`}>
              {eyebrow}
            </div>
          )}
          {title && <h1 className="font-display text-4xl lg:text-5xl font-medium text-black tracking-tight">{title}</h1>}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-12 grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
        {/* Categories sidebar */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-5">Categorias</div>
          <ul className="flex flex-col">
            {cats.map((c) => {
              const active = cat === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    onClick={() => setCat(c.slug)}
                    className={`w-full flex items-center justify-between gap-3 py-2.5 pl-4 -ml-px border-l-2 text-sm transition-colors ${
                      active ? "border-red-600 text-black font-semibold" : "border-gray-100 text-gray-500 hover:text-black hover:border-gray-300"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className={`text-[11px] ${active ? "text-red-600" : "text-gray-300"}`}>{count(c.slug)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Product grid */}
        <div>
          {/* Top bar: count + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="text-xs text-gray-400 font-medium">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </div>
            {searchable && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2.5 w-full sm:w-72 focus-within:border-black transition-colors">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((it) => (
              <Link
                key={it.id}
                href={it.href}
                className="bg-white border border-gray-100 group flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[16/10] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {it.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={it.image} alt={it.name} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <svg width="60" height="60" viewBox="0 0 32 32" aria-hidden>
                      <path d="M16 3L29 16L16 29L3 16Z" fill="#0a0a0a" opacity="0.07" />
                      <path d="M16 9L23 16L16 23L9 16Z" fill="#1878b6" opacity="0.12" />
                    </svg>
                  )}
                  {it.badge && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-medium px-2 py-1 uppercase tracking-wider">{it.badge}</span>
                  )}
                  {it.comparePrice && it.price && it.comparePrice > it.price && (
                    <span className="absolute top-3 right-3 bg-black text-white text-[9px] font-medium px-2 py-1">
                      -{Math.round((1 - it.price / it.comparePrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-7 flex flex-col flex-1 border-t border-gray-100">
                  {(it.brand || it.sku) && (
                    <div className="text-[9px] font-medium tracking-widest text-gray-400 uppercase mb-3">
                      {[it.brand, it.sku].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  <h3 className="text-[15px] font-medium text-black leading-snug mb-6 group-hover:text-red-600 transition-colors flex-1">
                    {it.name}
                  </h3>
                  <div className="flex items-center justify-between gap-2 pt-5 border-t border-gray-50">
                    {it.quoteOnly || it.price == null ? (
                      <span className="text-xs text-gray-400 italic">Sob consulta</span>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-medium">{fmt(it.price)}</span>
                        {it.comparePrice && it.comparePrice > it.price && <span className="text-[10px] text-gray-400 line-through">{fmt(it.comparePrice)}</span>}
                      </div>
                    )}
                    {SHOP_ENABLED && it.cart ? (
                      <button
                        onClick={(e) => { e.preventDefault(); add(it.cart!); }}
                        className="p-2 bg-gray-100 hover:bg-black hover:text-white text-gray-600 transition-all shrink-0"
                        title="Adicionar ao carrinho"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    ) : (
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-24 text-center text-gray-400">Sem resultados{q ? ` para "${search}"` : " nesta categoria"}.</div>
          )}

          {/* Pagination */}
          {pageSize && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                className="h-9 w-9 grid place-items-center border border-gray-200 text-gray-600 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 text-xs font-semibold border transition-colors ${
                    current === i + 1 ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={current === totalPages}
                className="h-9 w-9 grid place-items-center border border-gray-200 text-gray-600 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
                aria-label="Seguinte"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
