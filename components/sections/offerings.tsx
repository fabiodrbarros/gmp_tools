import Link from "next/link";
import { SERVICES } from "@/lib/services";

// Optional photo per service (drop files in /public/images/servicos/ and map here).
// Falls back to a dark placeholder until real images are provided.
const IMAGES: Record<string, string | undefined> = {
  "01": "/images/servicos/01-maquinas.jpg",
  "02": "/images/servicos/02-ferramentas.jpg",
  "03": "/images/servicos/03-suporte.jpg",
  "04": "/images/servicos/04-formacao.jpg",
};

export function Offerings() {
  const items = SERVICES;

  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden">
      {/* subtle depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(24,120,182,0.14),transparent_60%)]" />

      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-12 pt-20 lg:pt-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-14 lg:mb-20">
          <div>
            <span className="block text-[11px] font-medium tracking-[0.35em] text-red-500 uppercase mb-5">O que oferecemos</span>
            <h2 className="font-display uppercase font-medium tracking-tight leading-[0.9] text-white text-[clamp(2.4rem,6vw,5rem)]">
              Os nossos <span className="text-red-500">serviços.</span>
            </h2>
          </div>
          <div className="lg:pl-8 lg:border-l border-white/15 lg:max-w-xs">
            <p className="text-white/60 text-[15px] leading-relaxed font-light">
              Quatro áreas. Uma só missão: fornecer soluções que fazem a diferença na sua produção.
            </p>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-12 pb-20 lg:pb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {items.map((s, i) => (
          <Link
            key={s.num}
            href="/servicos"
            className="group relative flex flex-col min-h-[340px] lg:min-h-[460px] overflow-hidden"
          >
            {/* Photo / placeholder */}
            {IMAGES[s.num] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={IMAGES[s.num]}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent">
                <svg viewBox="0 0 32 32" className="absolute bottom-8 left-1/2 -translate-x-1/2 h-16 w-16 opacity-[0.06]" fill="none" aria-hidden>
                  <path d="M16 3L29 16L16 29L3 16Z" fill="#1878b6" />
                </svg>
              </div>
            )}
            {/* Legibility gradient (top only, keeps labels readable) */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0a0a0a] to-transparent" />

            {/* Label */}
            <div className="relative z-10 p-7 lg:p-8">
              <span className="block text-[13px] font-medium tracking-widest text-white/40 mb-4 group-hover:text-red-500 transition-colors">{s.num}</span>
              <h3 className="font-display uppercase font-medium text-white leading-[1.05] tracking-tight text-xl lg:text-2xl">
                {s.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
