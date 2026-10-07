"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { t } = useLang();
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-[#0a0a0a]">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover grayscale"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster=""
      >
        <source src="/videos/video-banner-site-web.mp4" type="video/mp4" />
      </video>

      {/* Overlays for legibility */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-red-600/40" />

      {/* Headline */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-screen-xl mx-auto px-6 lg:px-16">
          <h1 className="font-display font-medium tracking-tight text-white leading-[0.9] text-[clamp(1.3rem,6.2vw,5.6rem)]">
            {/* Always exactly two lines; the second in the logo red */}
            <Line delay={0.15} className="whitespace-nowrap">{t("hero.l1")}</Line>
            <Line delay={0.28} className="whitespace-nowrap text-red-600">{t("hero.l2")}</Line>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/produtos"
              className="group inline-flex items-center gap-2 bg-red-600 text-white text-xs font-semibold uppercase tracking-[0.12em] px-5 py-2.5"
            >
              {t("hero.cta")}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] text-white/60 uppercase font-medium">{t("hero.scroll")}</span>
        <span className="block w-px h-12 bg-white/20 relative overflow-hidden">
          <motion.span
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-red-500"
          />
        </span>
      </motion.div>
    </section>
  );
}

function Line({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="block overflow-hidden py-[0.04em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: EASE }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}
