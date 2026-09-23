import type { Metadata } from "next";
import { Saira, Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart";
import { LanguageProvider } from "@/lib/i18n";
import { ConfirmProvider } from "@/components/ui/confirm";
import { getCustomer } from "@/lib/customer-auth";
import { getLocale } from "@/lib/i18n-server";
import "./globals.css";

// Display: industrial grotesque echoing the GMP wordmark — heavy, squared, wide
const saira = Saira({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Body: neutral, highly legible
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// The catalog is DB-backed; the DB lives in a runtime volume (empty at build time).
// Render on each request so pages always reflect the live database.
export const dynamic = "force-dynamic";

const SITE_DESCRIPTION = "Soluções para a indústria da pedra.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gmptools.fabiodrbarros.cloud"),
  title: { default: "GMP Tools", template: "%s | GMP Tools" },
  description: SITE_DESCRIPTION,
  keywords: ["ferramentas diamantadas", "máquinas", "granito", "mármore", "quartzo", "cerâmica", "Thibaut", "Aquafil", "Portugal"],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "GMP Tools",
    title: "GMP Tools",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "GMP Tools",
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [customer, locale] = await Promise.all([getCustomer(), getLocale()]);
  return (
    <html lang={locale} className={`${saira.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <ConfirmProvider>
              <Header customer={customer ? { name: customer.name } : null} />
              <main>{children}</main>
              <Footer />
            </ConfirmProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
