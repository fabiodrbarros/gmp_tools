"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/i18n";

const navLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.products", href: "/produtos" },
  { key: "nav.newMachines", href: "/maquinas" },
  { key: "nav.usedMachines", href: "/maquinas/usadas" },
  { key: "nav.services", href: "/servicos" },
  { key: "nav.news", href: "/noticias" },
  { key: "nav.about", href: "/sobre" },
  { key: "nav.contact", href: "/contactos" },
];

export function Footer() {
  const { t } = useLang();
  const pathname = usePathname();

  if (pathname.startsWith("/gmp-panel-admin")) return null;

  return (
    <footer className="bg-[#fafafa] border-t border-gray-100">
      <div className="w-[min(92vw,1180px)] mx-auto pt-20 pb-8">
        {/* Top */}
        <div className="grid lg:grid-cols-[1.6fr_1fr_1.2fr] gap-12 lg:gap-16 pb-12 border-b border-gray-200">
          {/* Brand */}
          <div>
            <Logo height={52} />
            <p className="mt-6 text-[13px] font-light text-gray-500 leading-relaxed max-w-[34ch]">
              {t("common.menuTagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-red-600 uppercase mb-5">{t("footer.nav")}</div>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-red-600 uppercase mb-5">{t("footer.contacts")}</div>
            <div className="space-y-4">
              <ContactItem label={t("footer.address")}>
                {SITE.address.street}<br />{SITE.address.postal}
              </ContactItem>
              <ContactItem label={t("footer.mobile")}>
                <a href={`tel:${SITE.phoneHref}`} className="hover:text-red-600 transition-colors">{SITE.phone}</a>
                <span className="block text-[11px] text-gray-400 font-light">({t("common.callcost")})</span>
              </ContactItem>
              <ContactItem label={t("footer.email")}>
                <a href={`mailto:${SITE.email}`} className="hover:text-red-600 transition-colors">{SITE.email}</a>
              </ContactItem>
              <ContactItem label={t("footer.hours")}>
                {t("site.hours")}
              </ContactItem>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center gap-4 mt-7">
          <span className="flex-1 text-[12px] text-gray-400">
            © {new Date().getFullYear()} {SITE.name} — {t("footer.rights")}
          </span>
          <a
            href="https://www.livroreclamacoes.pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-[12px] text-red-600 hover:text-red-700 transition-colors"
          >
            {t("footer.complaints")}
          </a>
          <a
            href={SITE.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-right text-[12px] text-gray-400 hover:text-red-600 transition-colors"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold tracking-[0.14em] text-gray-400 uppercase">{label}</span>
      <span className="text-[13px] text-gray-600 leading-relaxed">{children}</span>
    </div>
  );
}
