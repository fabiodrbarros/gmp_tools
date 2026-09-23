"use client";

import * as React from "react";
import { DICT, LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n-dict";

export type { Locale };
export { LOCALES };

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LangCtx = React.createContext<Ctx | null>(null);

export function LanguageProvider({ children, initialLocale = "pt" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("gmp-locale", l); } catch {}
    // Persist for the server (SSR reads this cookie) — 1 year.
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.lang = l;
  }, []);

  const t = React.useCallback(
    (key: string) => DICT[locale]?.[key] ?? DICT.pt[key] ?? key,
    [locale]
  );

  return <LangCtx.Provider value={{ locale, setLocale, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = React.useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
