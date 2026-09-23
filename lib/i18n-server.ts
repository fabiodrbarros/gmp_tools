import { cookies } from "next/headers";
import { DICT, LOCALES, LOCALE_COOKIE, translate, type Locale } from "@/lib/i18n-dict";

/** Reads the locale cookie on the server (defaults to pt). */
export async function getLocale(): Promise<Locale> {
  try {
    const v = (await cookies()).get(LOCALE_COOKIE)?.value as Locale | undefined;
    if (v && LOCALES.includes(v)) return v;
  } catch {}
  return "pt";
}

/** Returns a translator bound to the current server locale. */
export async function getT(): Promise<{ locale: Locale; t: (key: string) => string }> {
  const locale = await getLocale();
  return { locale, t: (key: string) => translate(locale, key) };
}

export { DICT, LOCALES };
