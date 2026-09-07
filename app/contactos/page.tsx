import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contactos",
  description: "Fale com a GMP Tools — orçamentos, assistência técnica e avarias urgentes. Telefone, email, morada e formulário de contacto.",
};

const ITEMS = [
  { icon: MapPin, label: "Morada", value: `${SITE.address.street}, ${SITE.address.postal}` },
  { icon: Phone, label: "Telemóvel", value: SITE.phone, href: `tel:${SITE.phoneHref}`, note: SITE.phoneNote },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Clock, label: "Horário", value: SITE.hours },
];

export default function ContactosPage() {
  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — heading + details + assistance */}
          <div className="lg:sticky lg:top-28 self-start">
            <h1 className="font-display uppercase font-medium text-black tracking-tight leading-[0.95] text-[clamp(2.4rem,5vw,4rem)] mb-6">
              Fale com a<br /><span className="text-red-600">nossa equipa.</span>
            </h1>
            <div className="w-16 h-0.5 bg-red-600 mb-8 mt-8" />

            {/* Contact items */}
            <div className="space-y-5 max-w-md">
              {ITEMS.map((it) => (
                <div key={it.label} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 group-hover:border-red-600 group-hover:bg-red-600 transition-colors">
                    <it.icon className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 tracking-[0.15em] uppercase mb-1">{it.label}</div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      {it.href ? (
                        <a href={it.href} className="text-[15px] text-gray-800 hover:text-red-600 transition-colors">{it.value}</a>
                      ) : (
                        <span className="text-[15px] text-gray-800">{it.value}</span>
                      )}
                      {it.note && <span className="text-[11px] text-gray-400 font-light">({it.note})</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right — form */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6">Enviar mensagem</div>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Map — constrained to the page content width */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 pb-20 lg:pb-28">
        <div className="h-[420px] border border-gray-100">
          <iframe
            title="Localização GMP Tools"
            src="https://maps.google.com/maps?q=Rua%20do%20Barreiro%2C%204730-590%20Turiz%2C%20Portugal&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full grayscale"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
