import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { getT } from "@/lib/i18n-server";

export async function ContactCTA() {
  const { t } = await getT();
  return (
    <section className="py-28 bg-gray-50 border-t border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-medium tracking-[0.2em] text-red-600 uppercase mb-3">{t("cta.eyebrow")}</div>
            <h2 className="text-5xl font-medium text-black leading-tight mb-6">
              {t("cta.h1")}<br />{t("cta.h2")}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              {t("cta.body")}
            </p>
            <div>
              <Link href="/contactos" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors group">
                {t("cta.button")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <a href={`tel:${SITE.phoneHref}`} className="flex items-center gap-5 p-6 bg-white border border-gray-100 hover:border-gray-300 transition-all group">
              <div className="h-12 w-12 bg-black flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-medium tracking-widest text-gray-400 uppercase mb-0.5">{t("contact.phoneLabel")}</div>
                <div className="text-base font-medium text-black">{SITE.phone}</div>
                <div className="text-xs text-gray-400">{SITE.hours}</div>
              </div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-5 p-6 bg-white border border-gray-100 hover:border-gray-300 transition-all group">
              <div className="h-12 w-12 bg-black flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-medium tracking-widest text-gray-400 uppercase mb-0.5">{t("contact.emailLabel")}</div>
                <div className="text-base font-medium text-black">{SITE.email}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
