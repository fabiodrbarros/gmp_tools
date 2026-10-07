import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  "Ponteadoras automáticas CNC",
  "Serra de ponte 5 eixos",
  "Chanfradeiras e bordejadoras",
  "Peças originais em stock",
  "Assistência certificada",
  "Formação incluída",
];

export function ThibautBanner() {
  return (
    <section className="bg-red-600 relative overflow-hidden">
      {/* Subtle diamond pattern bg */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          <path d="M200 0L400 300L200 600L0 300Z" fill="#000000" />
        </svg>
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 py-24 lg:py-32">
        {/* Top label */}
        <div className="flex items-center gap-3 mb-16">
          <span className="block w-8 h-px bg-white" />
          <span className="text-[11px] font-semibold tracking-[0.3em] text-white/70 uppercase">
            Representante exclusivo · Portugal
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-end">
          {/* Left */}
          <div>
            <h2 className="text-[clamp(4rem,9vw,8rem)] font-medium text-white leading-[0.85] tracking-tight mb-8">
              Thibaut.
            </h2>
            <p className="text-[13px] font-semibold tracking-[0.2em] text-white/20 uppercase mb-8">
              Desde 1960 · França
            </p>
            <p className="text-white/50 text-base leading-relaxed max-w-sm mb-10">
              A referência mundial em maquinaria para granitos, mármores, quartzo e cerâmicos. Equipamentos que definem o estado da arte no processamento de granitos, mármores, quartzo e cerâmicos.
            </p>
            <Link
              href="/maquinas"
              className="inline-flex items-center gap-2.5 text-white border border-white/20 text-[13px] font-semibold px-8 py-4 hover:bg-black hover:border-black transition-all group"
            >
              Ver máquinas Thibaut
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right — feature list */}
          <div>
            <div className="divide-y divide-white/5">
              {features.map((f, i) => (
                <div key={f} className="flex items-center gap-4 py-4">
                  <span className="text-[10px] font-semibold text-white/20 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] text-white/60">{f}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
              {[
                { value: "60+", label: "Países" },
                { value: "T500", label: "Modelo topo" },
                { value: "24h", label: "Suporte" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-medium text-white mb-1">{s.value}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
