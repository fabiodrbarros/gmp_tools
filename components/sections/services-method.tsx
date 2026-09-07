"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { SERVICES } from "@/lib/services";

const PANELS = SERVICES.length + 1; // intro + services
const STEP_EASE = "cubic-bezier(0.16,1,0.3,1)";

export function ServicesMethod() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = React.useState(0);

  // Each scroll advances FULLY to the next/previous panel — never rests mid-panel
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(PANELS - 1, Math.max(0, Math.round(v * (PANELS - 1))));
    setIndex(i);
  });

  return (
    <section ref={ref} className="relative bg-white" style={{ height: `${PANELS * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden border-b border-gray-100">
        <div
          className="flex flex-nowrap h-full will-change-transform"
          style={{ transform: `translateX(-${index * 100}vw)`, transition: `transform 700ms ${STEP_EASE}` }}
        >
          {/* Intro panel */}
          <div className="w-screen h-full shrink-0 flex items-center px-6 sm:px-[8vw]">
            <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <span className="block text-[11px] font-medium tracking-[0.3em] text-red-600 uppercase mb-6">O que fazemos</span>
                <h2 className="font-display uppercase font-medium text-black leading-[0.92] tracking-tight text-[clamp(2.8rem,7vw,6.5rem)]">
                  Os Nossos<br /><span className="text-red-600">Serviços.</span>
                </h2>
              </div>
              <div className="lg:col-span-5 lg:pl-12 lg:border-l border-gray-200">
                <span className="block text-[11px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-4">01 / {String(PANELS).padStart(2, "0")}</span>
                <p className="text-gray-500 text-lg leading-relaxed font-light max-w-[40ch] mb-8">
                  Do fornecimento à assistência técnica, somos o parceiro completo para ferramentas diamantadas e máquinas CNC. Quatro serviços, um compromisso: manter a sua produção a funcionar.
                </p>
                <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] text-gray-400 uppercase">
                  <span>Deslize para explorar</span>
                  <ArrowDown className="h-4 w-4 animate-bounce text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Service panels */}
          {SERVICES.map((s) => (
            <div key={s.num} className="w-screen h-full shrink-0 flex items-center px-6 sm:px-[8vw]">
              <div className="relative max-w-screen-xl w-full mx-auto">
                {/* Giant outlined number — anchored to this panel's content */}
                <span
                  className="pointer-events-none select-none absolute right-0 lg:right-[-2vw] top-1/2 -translate-y-1/2 font-display font-medium leading-none text-[40vw] lg:text-[26vw] z-0"
                  style={{ WebkitTextStroke: "2px rgba(24,120,182,0.14)", color: "transparent" }}
                  aria-hidden
                >
                  {s.num}
                </span>

                <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7">
                    <span className="block text-[11px] font-medium tracking-[0.3em] text-red-600 uppercase mb-5">{s.eyebrow}</span>
                    <h3 className="font-display uppercase font-medium text-black leading-[0.95] tracking-tight text-[clamp(2.2rem,5.5vw,5rem)] mb-6">
                      {s.title}
                    </h3>
                    <p className="text-gray-500 text-base lg:text-lg leading-relaxed font-light max-w-[44ch] mb-8">{s.desc}</p>
                    <Link
                      href={s.cta.href}
                      className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-7 py-3.5 hover:bg-red-600 transition-colors group"
                    >
                      {s.cta.label}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Step indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2">
          {Array.from({ length: PANELS }).map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 32 : 8,
                backgroundColor: i === index ? "#1878b6" : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
