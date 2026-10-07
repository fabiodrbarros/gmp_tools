"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { useLang } from "@/lib/i18n";

const PANELS = SERVICES.length + 1; // intro + services
const STEP_EASE = "cubic-bezier(0.16,1,0.3,1)";

// Slide index for a "#servico-XX" hash (menu deep links), or null
function indexFromHash(hash: string): number | null {
  const m = hash.match(/^#servico-(\d+)$/);
  if (!m) return null;
  const i = SERVICES.findIndex((s) => s.num === m[1]);
  return i === -1 ? null : i + 1;
}

// Services carousel — moves ONLY via the side arrows / dots / keyboard / swipe.
// The mouse wheel scrolls the page normally (no scroll-jacking).
export function ServicesMethod() {
  const { t } = useLang();
  const [index, setIndex] = React.useState(0);
  const touchX = React.useRef<number | null>(null);

  const go = React.useCallback((i: number) => setIndex(Math.min(PANELS - 1, Math.max(0, i))), []);

  React.useEffect(() => {
    const sync = () => {
      const i = indexFromHash(window.location.hash);
      if (i !== null) setIndex(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  }

  return (
    <section
      className="relative bg-white border-b border-gray-100 outline-none"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {/* Deep-link targets for the menu (#servico-03 …) */}
      {SERVICES.map((s) => <span key={s.num} id={`servico-${s.num}`} className="absolute top-0 scroll-mt-24" aria-hidden />)}

      <div className="relative h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden">
        <div
          className="flex flex-nowrap h-full will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)`, transition: `transform 700ms ${STEP_EASE}` }}
        >
          {/* Intro panel */}
          <div className="w-full h-full shrink-0 flex items-center px-16 sm:px-[8vw]" aria-hidden={index !== 0}>
            <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <span className="block text-[11px] font-medium tracking-[0.3em] text-red-600 uppercase mb-6">{t("svc.eyebrow")}</span>
                <h2 className="font-display uppercase font-medium text-black leading-[0.92] tracking-tight text-[clamp(2.8rem,7vw,6.5rem)]">
                  {t("svc.title1")}<br /><span className="text-red-600">{t("svc.title2")}</span>
                </h2>
              </div>
              <div className="lg:col-span-5 lg:pl-12 lg:border-l border-gray-200">
                <p className="text-gray-500 text-lg leading-relaxed font-light max-w-[40ch]">
                  {t("svc.intro")}
                </p>
              </div>
            </div>
          </div>

          {/* Service panels */}
          {SERVICES.map((s, i) => (
            <div key={s.num} className="w-full h-full shrink-0 flex items-center px-16 sm:px-[8vw]" aria-hidden={index !== i + 1}>
              <div className="relative max-w-screen-xl w-full mx-auto">
                {/* Giant outlined number — anchored to this panel's content */}
                <span
                  className="pointer-events-none select-none absolute right-0 lg:right-[-2vw] top-1/2 -translate-y-1/2 font-display font-medium leading-none text-[40vw] lg:text-[26vw] z-0"
                  style={{ WebkitTextStroke: "2px rgba(211,25,43,0.14)", color: "transparent" }}
                  aria-hidden
                >
                  {s.num}
                </span>

                <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7">
                    <span className="block text-[11px] font-medium tracking-[0.3em] text-red-600 uppercase mb-5">{t("svc.word")} {s.num}</span>
                    <h3 className="font-display uppercase font-medium text-black leading-[0.95] tracking-tight text-[clamp(2.2rem,5.5vw,5rem)] mb-6">
                      {t(`svc.${s.num}.title`)}
                    </h3>
                    <p className="text-gray-500 text-base lg:text-lg leading-relaxed font-light max-w-[44ch] mb-8">{t(`svc.${s.num}.desc`)}</p>
                    <Link
                      href={s.cta.href}
                      tabIndex={index === i + 1 ? 0 : -1}
                      className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-7 py-3.5 hover:bg-red-600 transition-colors group"
                    >
                      {t(`svc.${s.num}.cta`)}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Side arrows */}
        <SideArrow dir="prev" disabled={index === 0} onClick={() => go(index - 1)} />
        <SideArrow dir="next" disabled={index === PANELS - 1} onClick={() => go(index + 1)} />

        {/* Step indicators (clickable) */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2">
          {Array.from({ length: PANELS }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1} / ${PANELS}`}
              aria-current={i === index}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 32 : 8,
                backgroundColor: i === index ? "#d3192b" : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SideArrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Anterior" : "Seguinte"}
      className={`absolute top-1/2 -translate-y-1/2 ${dir === "prev" ? "left-3 sm:left-6" : "right-3 sm:right-6"} z-20 grid place-items-center h-12 w-12 border border-gray-200 bg-white text-black hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
