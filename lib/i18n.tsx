"use client";

import * as React from "react";

export type Locale = "pt" | "en" | "fr";
export const LOCALES: Locale[] = ["pt", "en", "fr"];

type Dict = Record<string, string>;

const DICT: Record<Locale, Dict> = {
  pt: {
    "nav.home": "Início",
    "nav.products": "Produtos",
    "nav.newMachines": "Máquinas novas",
    "nav.usedMachines": "Máquinas usadas",
    "nav.services": "Os Nossos Serviços",
    "nav.news": "Notícias",
    "nav.support": "Assistência",
    "nav.about": "A GMP",
    "nav.contact": "Contactos",
    "nav.cart": "Carrinho",
    "menu.contact": "Contacto",
    "menu.address": "Morada",
    "menu.hours": "Horário",
    "footer.nav": "Navegação",
    "footer.contacts": "Contactos",
    "footer.address": "Morada",
    "footer.mobile": "Telemóvel",
    "footer.email": "Email",
    "footer.hours": "Horário",
    "footer.rights": "Todos os direitos reservados.",
    "footer.complaints": "Livro de Reclamações",
    "footer.exclusive": "Representante exclusivo Thibaut · Portugal",
    "common.tagline": "Soluções para granitos, mármores, quartzo e cerâmicos. Ferramentas diamantadas, maquinaria e apoio técnico.",
    "common.menuTagline": "Soluções para a indústria da pedra.",
    "common.quote": "Pedir orçamento",
    "common.callcost": "Chamada para rede móvel nacional",
  },
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.newMachines": "New Machines",
    "nav.usedMachines": "Used Machines",
    "nav.services": "Our Services",
    "nav.support": "Support",
    "nav.about": "About GMP",
    "nav.contact": "Contact",
    "nav.cart": "Cart",
    "menu.contact": "Contact",
    "menu.address": "Address",
    "menu.hours": "Hours",
    "footer.nav": "Navigation",
    "footer.contacts": "Contacts",
    "footer.address": "Address",
    "footer.mobile": "Mobile",
    "footer.email": "Email",
    "footer.hours": "Hours",
    "footer.rights": "All rights reserved.",
    "footer.complaints": "Complaints Book",
    "footer.exclusive": "Exclusive Thibaut representative · Portugal",
    "common.tagline": "Solutions for granite, marble, quartz and ceramics. Diamond tools, machinery and technical support.",
    "common.menuTagline": "Solutions for the stone industry.",
    "common.quote": "Request a quote",
    "common.callcost": "National mobile network call",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.newMachines": "Machines neuves",
    "nav.usedMachines": "Machines d'occasion",
    "nav.services": "Nos Services",
    "nav.support": "Assistance",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.cart": "Panier",
    "menu.contact": "Contact",
    "menu.address": "Adresse",
    "menu.hours": "Horaires",
    "footer.nav": "Navigation",
    "footer.contacts": "Contacts",
    "footer.address": "Adresse",
    "footer.mobile": "Mobile",
    "footer.email": "Email",
    "footer.hours": "Horaires",
    "footer.rights": "Tous droits réservés.",
    "footer.complaints": "Livre de Réclamations",
    "footer.exclusive": "Représentant exclusif Thibaut · Portugal",
    "common.tagline": "Solutions pour granit, marbre, quartz et céramique. Outils diamantés, machinerie et support technique.",
    "common.menuTagline": "Solutions pour l'industrie de la pierre.",
    "common.quote": "Demander un devis",
    "common.callcost": "Appel vers réseau mobile national",
  },
};

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LangCtx = React.createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("pt");

  React.useEffect(() => {
    const saved = localStorage.getItem("gmp-locale") as Locale | null;
    if (saved && LOCALES.includes(saved)) setLocaleState(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("gmp-locale", l);
  }, []);

  const t = React.useCallback(
    (key: string) => DICT[locale][key] ?? DICT.pt[key] ?? key,
    [locale]
  );

  return <LangCtx.Provider value={{ locale, setLocale, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = React.useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
