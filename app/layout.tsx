import type { Metadata } from "next";
import { Saira, Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart";
import { LanguageProvider } from "@/lib/i18n";
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

export const metadata: Metadata = {
  title: { default: "GMP Tools", template: "%s | GMP Tools" },
  description: "Ferramentas diamantadas, máquinas CNC e soluções para granitos, mármores, quartzo e cerâmicos. Representante exclusivo Thibaut em Portugal.",
  keywords: ["ferramentas diamantadas", "CNC", "granito", "mármore", "quartzo", "cerâmica", "Thibaut", "Portugal"],
  openGraph: { type: "website", locale: "pt_PT", siteName: "GMP Tools" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${saira.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
