"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";
import { useCart } from "@/lib/cart";
import { useLang, LOCALES, type Locale } from "@/lib/i18n";
import { SITE, SHOP_ENABLED } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const MENU_LINKS = [
  { key: "nav.home", href: "/" },
  { key: "nav.products", href: "/produtos" },
  { key: "nav.newMachines", href: "/maquinas" },
  { key: "nav.usedMachines", href: "/maquinas/usadas" },
  { key: "nav.services", href: "/servicos" },
  { key: "nav.news", href: "/noticias" },
  { key: "nav.about", href: "/sobre" },
  { key: "nav.contact", href: "/contactos" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { count } = useCart();
  const { t } = useLang();

  const isHome = pathname === "/";

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  React.useEffect(() => { setOpen(false); }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  if (pathname.startsWith("/gmp-panel-admin")) return null;

  // Header gets a solid white background only once scrolled (menu closed)
  const solid = scrolled && !open;
  // White text/icons only over a dark full-screen hero while at the top
  const overHero = isHome || pathname === "/sobre";
  const light = overHero && !scrolled && !open;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[120] transition-[background-color,box-shadow,border-color,padding] duration-500"
        style={{
          transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          backgroundColor: solid ? "#ffffff" : "transparent",
          boxShadow: solid ? "0 1px 20px rgba(0,0,0,0.05)" : "none",
          borderBottom: solid ? "1px solid #f3f4f6" : "1px solid transparent",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Header logo hidden while the menu overlay is open (the menu shows its own) */}
            {open ? <span /> : <Logo white={light} height={34} />}

            <div className="flex items-center gap-5 md:gap-7">
              {/* Inline featured links — hidden while the menu overlay is open */}
              {!open && (
                <nav className="hidden md:flex items-center gap-7">
                  <InlineLink href="/sobre" light={light}>{t("nav.about")}</InlineLink>
                  <InlineLink href="/servicos" light={light}>{t("nav.services")}</InlineLink>
                </nav>
              )}

              {/* Language selector */}
              <LanguageSelector light={light} />

              {/* Menu toggle */}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                aria-expanded={open}
                className={`-mr-1 grid place-items-center h-11 w-11 transition-colors ${
                  light ? "text-white hover:text-red-500" : "text-black hover:text-red-600"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <X className="h-6 w-6" />
                    </motion.span>
                  ) : (
                    <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <Menu className="h-6 w-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[110] bg-white text-black overflow-y-auto"
          >
            <div className="min-h-full grid lg:grid-cols-[1fr_1.5fr_1fr]">
              {/* Column 1 — brand */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="hidden lg:flex flex-col justify-between px-10 xl:px-14 py-[13vh] border-r border-gray-100"
              >
                <div>
                  <Logo height={46} />
                  <p className="mt-8 text-sm font-light text-gray-500 leading-relaxed max-w-[30ch]">
                    {t("common.menuTagline")}
                  </p>
                </div>
              </motion.div>

              {/* Column 2 — navigation */}
              <div className="flex flex-col justify-center px-6 lg:px-12 xl:px-16 lg:border-r border-gray-100 pt-24 lg:pt-0 pb-10 lg:pb-0">
                <nav className="flex flex-col">
                  {MENU_LINKS.map((item, i) => (
                    <MaskReveal key={item.href} delay={0.2 + i * 0.05}>
                      <Link href={item.href} className="group inline-flex items-center gap-4 py-2 lg:py-2.5 w-fit">
                        <span className="font-display uppercase font-semibold text-2xl sm:text-3xl lg:text-[clamp(1.6rem,2.3vw,2.25rem)] leading-tight tracking-tight text-black group-hover:text-red-600 transition-colors duration-300">
                          {t(item.key)}
                        </span>
                        <span className="h-px w-0 bg-red-600 group-hover:w-10 transition-all duration-300 hidden sm:block" />
                      </Link>
                    </MaskReveal>
                  ))}
                </nav>
              </div>

              {/* Column 3 — info / contacts */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
                className="flex flex-col justify-end gap-7 px-6 lg:px-12 py-12 lg:py-[13vh] lg:border-l border-gray-100"
              >
                <MenuInfo title={t("menu.contact")}>
                  <a href={`mailto:${SITE.email}`} className="block text-[15px] text-gray-700 hover:text-red-600 transition-colors">{SITE.email}</a>
                  <a href={`tel:${SITE.phoneHref}`} className="block text-[15px] text-gray-700 hover:text-red-600 transition-colors mt-1">{SITE.phone}</a>
                  <span className="block text-[11px] text-gray-400 mt-0.5">{SITE.phoneNote}</span>
                </MenuInfo>
                <MenuInfo title={t("menu.address")}>
                  <p className="text-sm text-gray-500 leading-relaxed">{SITE.address.street}<br />{SITE.address.postal}</p>
                </MenuInfo>
                <MenuInfo title={t("menu.hours")}>
                  <p className="text-sm text-gray-500">{SITE.hours}</p>
                </MenuInfo>
                <div className="flex items-center gap-6 pt-2">
                  {SHOP_ENABLED && (
                    <Link href="/carrinho" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
                      <ShoppingCart className="h-4 w-4" />
                      {t("nav.cart")}{count > 0 ? ` (${count})` : ""}
                    </Link>
                  )}
                  <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-red-600 transition-colors">
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                  <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-red-600 transition-colors">
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!overHero && <div className="h-16" />}
    </>
  );
}

function MenuInfo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase mb-2">{title}</div>
      {children}
    </div>
  );
}

function InlineLink({ href, light, children }: { href: string; light: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`group relative text-[11px] font-semibold uppercase tracking-[0.15em] py-1 transition-colors duration-300 ${
        light ? "text-white/80 hover:text-red-500" : "text-gray-600 hover:text-red-600"
      }`}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-red-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function LanguageSelector({ light }: { light: boolean }) {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Idioma"
        aria-expanded={open}
        className={`flex items-center gap-1.5 border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          light
            ? "border-white/25 text-white hover:border-red-500 hover:text-red-500"
            : "border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600"
        }`}
      >
        {locale}
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-24 bg-white border border-gray-100 shadow-xl py-1 z-[130]"
          >
            {LOCALES.map((l) => (
              <li key={l}>
                <button
                  onClick={() => { setLocale(l as Locale); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    l === locale ? "text-red-600" : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {l}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function MaskReveal({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
