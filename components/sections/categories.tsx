import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cats = [
  {
    slug: "discos-diamantados",
    num: "01",
    name: "Discos Diamantados",
    desc: "Corte de granito, mármore, betão e cerâmica com máxima precisão.",
    count: "48+",
  },
  {
    slug: "ferramentas-cnc",
    num: "02",
    name: "Ferramentas CNC",
    desc: "Fresas, perfis e ferramentas para routers de última geração.",
    count: "32+",
  },
  {
    slug: "frankfurt",
    num: "03",
    name: "Frankfurt & Polimento",
    desc: "Abrasivos profissionais para polimento automático de granitos, mármores, quartzo e cerâmicos.",
    count: "24+",
  },
  {
    slug: "acessorios",
    num: "04",
    name: "Acessórios",
    desc: "Brocas diamantadas, ventosas e equipamento auxiliar de qualidade.",
    count: "12+",
  },
];

export function Categories() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] text-red-600 uppercase mb-4">Catálogo</p>
            <h2 className="text-4xl lg:text-5xl font-medium text-black leading-[1.05] tracking-tight">
              A ferramenta certa<br />para cada trabalho.
            </h2>
          </div>
          <Link
            href="/produtos"
            className="hidden lg:inline-flex items-center gap-2 text-[13px] font-semibold text-gray-400 hover:text-black transition-colors"
          >
            Ver catálogo completo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
          {cats.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produtos?cat=${cat.slug}`}
              className="relative bg-white p-8 lg:p-10 group hover:bg-[#0a0a0a] transition-all duration-400 flex flex-col min-h-[280px] lg:min-h-[320px]"
            >
              {/* Number */}
              <span className="text-[11px] font-semibold text-gray-300 group-hover:text-white/20 transition-colors mb-6 tracking-widest">
                {cat.num}
              </span>

              {/* Title */}
              <h3 className="text-xl font-medium text-black group-hover:text-white transition-colors mb-3 leading-tight">
                {cat.name}
              </h3>

              {/* Desc */}
              <p className="text-[13px] text-gray-400 group-hover:text-white/40 transition-colors leading-relaxed flex-1">
                {cat.desc}
              </p>

              {/* Bottom */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 group-hover:border-white/10 transition-colors">
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white/30 transition-colors">
                  {cat.count} ref.
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-300 group-hover:text-red-400 transition-colors group-hover:translate-x-1 duration-200">
                  Ver <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              {/* Red bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
