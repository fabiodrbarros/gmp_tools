import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  {
    num: "01",
    title: "Assistência Técnica",
    desc: "Manutenção, reparação e calibração de máquinas e equipamento. Resposta em 48h.",
    href: "/contactos",
  },
  {
    num: "02",
    title: "Consultoria Técnica",
    desc: "Selecção da ferramenta ideal para cada material e aplicação.",
    href: "/servicos",
  },
  {
    num: "03",
    title: "Fornecimento Industrial",
    desc: "Gestão de stocks e fornecimento contínuo para grandes consumidores.",
    href: "/servicos",
  },
  {
    num: "04",
    title: "Soluções à Medida",
    desc: "Desenvolvimento de ferramentas e soluções específicas para processos especiais.",
    href: "/contactos",
  },
];

export function Services() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs font-medium tracking-[0.2em] text-red-600 uppercase mb-3">Serviços</div>
          <h2 className="text-5xl font-medium text-black">Mais do que ferramentas.</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
          {services.map((s) => (
            <Link
              key={s.num}
              href={s.href}
              className="bg-white p-8 group hover:bg-black transition-all duration-300 flex flex-col"
            >
              <div className="text-[10px] font-medium tracking-[0.3em] text-gray-300 group-hover:text-gray-600 mb-6 transition-colors">
                {s.num}
              </div>
              <h3 className="text-base font-medium text-black group-hover:text-white transition-colors mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed flex-1">
                {s.desc}
              </p>
              <ArrowRight className="h-4 w-4 text-gray-200 group-hover:text-white mt-6 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
