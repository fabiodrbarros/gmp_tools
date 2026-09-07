import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { ServicesMethod } from "@/components/sections/services-method";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Assistência técnica, consultoria, fornecimento industrial e instalação para ferramentas diamantadas e máquinas CNC.",
};

export default function ServicosPage() {
  return (
    <div className="bg-white">
      {/* Horizontal-scroll method section */}
      <ServicesMethod />

      {/* Bottom CTA */}
      <div className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="bg-[#0a0a0a] p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-medium text-white mb-2">Precisa de uma solução específica?</h3>
            <p className="text-gray-400">Contacte-nos. Desenvolvemos soluções à medida da sua empresa.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href={`tel:${SITE.phoneHref}`} className="flex items-center gap-2 text-white border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
              <Phone className="h-4 w-4" /> {SITE.phone}
            </a>
            <Link href="/contactos" className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 text-sm font-semibold hover:bg-red-700 transition-colors">
              Enviar mensagem <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
