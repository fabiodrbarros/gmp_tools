import { ArrowDown } from "lucide-react";
import { getT } from "@/lib/i18n-server";

export async function Stats() {
  const { t } = await getT();
  return (
    <section className="min-h-screen w-full flex items-center bg-white border-b border-gray-100 px-6 sm:px-[8vw]">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <h2 className="font-display uppercase font-medium text-black leading-[0.95] tracking-tight text-[clamp(2.1rem,4.8vw,4.4rem)]">
            {t("stats.h1")}<br /><span className="text-red-600">{t("stats.h2")}</span>
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pl-12 lg:border-l border-gray-200">
          <span className="block text-[11px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-4">{t("stats.eyebrow")}</span>
          <p className="text-gray-500 text-lg leading-relaxed font-light max-w-[40ch] mb-8">
            {t("stats.body")}
          </p>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] text-gray-400 uppercase">
            <span>{t("stats.scroll")}</span>
            <ArrowDown className="h-4 w-4 animate-bounce text-red-600" />
          </div>
        </div>
      </div>
    </section>
  );
}
