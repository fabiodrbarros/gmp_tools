import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { ServicesMethod } from "@/components/sections/services-method";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Venda de máquinas e ferramentas, suporte técnico e formação para a transformação de granitos, mármores, quartzo e cerâmicos.",
};

export default async function ServicosPage() {
  const { t } = await getT();
  return (
    <div className="bg-white">
      {/* Services carousel — arrows only, page scroll stays free */}
      <ServicesMethod />

      {/* Bottom CTA */}
      <div className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="bg-red-600 p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-medium text-white mb-2">{t("svc.cta.h")}</h3>
            <p className="text-white/80">{t("svc.cta.body")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={`tel:${SITE.phoneHref}`} className="flex items-center gap-2 text-white border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              <Phone className="h-4 w-4" /> {SITE.phone}
            </a>
            <Link href="/contactos" className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-900 transition-colors">
              {t("svc.cta.button")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
