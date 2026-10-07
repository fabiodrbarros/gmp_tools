import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutHero } from "@/components/sections/about-hero";
import { SERVICES } from "@/lib/services";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "A GMP",
  description: "Parceiro técnico para a transformação de granitos, mármores, quartzo e cerâmicos em Portugal — máquinas, ferramentas diamantadas, suporte técnico e formação. Representantes Thibaut e Aquafill.",
};

export default async function SobrePage() {
  const { t } = await getT();
  const VALUES = [
    { title: t("about.v1.title"), desc: t("about.v1.desc") },
    { title: t("about.v2.title"), desc: t("about.v2.desc") },
    { title: t("about.v3.title"), desc: t("about.v3.desc") },
  ];

  return (
    <div className="bg-white">
      <AboutHero />

      {/* Quem somos */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-16 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-black tracking-tight leading-none mb-8">
              {t("about.whoTitle")}
            </h2>
            <div className="space-y-5 text-gray-500 font-light leading-relaxed">
              <p>{t("about.whoP1")}</p>
              <p>{t("about.whoP2")}</p>
            </div>
            <div className="pt-8">
              <span className="block text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-4">{t("about.represent")}</span>
              <div className="flex flex-wrap items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/partners/thibaut.jpg" alt="Thibaut" className="h-12 w-auto object-contain" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/partners/aquafil.png" alt="Aquafil Solutions" className="h-12 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* O que fazemos */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border border-gray-100 divide-y divide-gray-100">
              {SERVICES.map((s) => (
                <div key={s.num} className="grid grid-cols-[56px_1fr] gap-5 p-6 hover:bg-gray-50 transition-colors">
                  <div className="font-display text-2xl font-medium text-gray-300">{s.num}</div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-black tracking-tight mb-1">{t(`svc.${s.num}.title`)}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">{t(`svc.${s.num}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores & Missão */}
      <section className="bg-[#fafafa] border-y border-gray-100 py-24 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <div className="mb-16">
            <span className="block text-[11px] font-semibold tracking-[0.3em] text-red-600 uppercase mb-5">{t("about.guides")}</span>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-black tracking-tight leading-tight mb-6">
              {t("about.valuesTitle")}
            </h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed lg:whitespace-nowrap">
              {t("about.valuesIntro")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {VALUES.map((v, i) => (
              <div key={v.title} className="bg-[#fafafa] p-8 lg:p-10">
                <span className="block text-[11px] font-semibold text-gray-300 mb-6 tracking-widest">0{i + 1}</span>
                <div className="w-8 h-0.5 bg-red-600 mb-5" />
                <h3 className="font-display text-xl font-medium text-black uppercase tracking-tight mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O Nosso Compromisso */}
      <section className="bg-red-600 py-24 lg:py-32 relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 relative">
          <div className="max-w-3xl">
            <span className="block text-[11px] font-semibold tracking-[0.3em] text-white/70 uppercase mb-5">{t("about.commitmentEyebrow")}</span>
            <h2 className="font-display text-3xl lg:text-5xl font-medium text-white tracking-tight leading-[1.05]">
              {t("about.commitment")}
            </h2>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-16 py-24 text-center">
        <h2 className="font-display text-3xl lg:text-5xl font-medium text-black tracking-tight mb-4">
          {t("about.ctaTitle")}
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto font-light">
          {t("about.ctaBody")}
        </p>
        <Link href="/contactos" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors group">
          {t("about.ctaButton")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
