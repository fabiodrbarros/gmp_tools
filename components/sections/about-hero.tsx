"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function AboutHero() {
  const { t } = useLang();
  const HEADLINE = t("about.heroHeadline").split(" ");
  return (
    <section className="relative min-h-screen flex items-end bg-[#0a0a0a] overflow-hidden">
      {/* Brand watermark */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        width="760" height="760" viewBox="0 0 700 700" fill="none"
        className="absolute right-[-12%] top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <path d="M350 30L670 350L350 670L30 350Z" fill="#1878b6" />
      </motion.svg>

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-red-600/40" />

      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 lg:px-16 pb-[14vh] pt-32">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="block text-[11px] font-semibold tracking-[0.3em] text-red-500 uppercase mb-7"
        >
          {t("about.eyebrow")}
        </motion.span>

        <h1 className="font-display uppercase font-medium text-white leading-[0.95] tracking-tight text-[clamp(2.6rem,7vw,6rem)] flex flex-wrap gap-x-[0.28em] mb-8 max-w-5xl">
          {HEADLINE.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden py-[0.05em]">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: EASE }}
                className="inline-block"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-lg text-white/55 max-w-2xl font-light leading-relaxed"
        >
          {t("about.heroBody")}
        </motion.p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 right-6 lg:right-16 hidden md:flex flex-col items-center gap-3 z-10 pointer-events-none">
        <div className="w-px h-16 bg-red-500/20 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-red-500"
          />
        </div>
        <span className="text-[9px] text-red-500/70 tracking-[0.25em] [writing-mode:vertical-rl] rotate-180 uppercase font-medium">
          {t("about.scroll")}
        </span>
      </div>
    </section>
  );
}
