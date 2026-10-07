export interface Service {
  num: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
}

export const SERVICES: Service[] = [
  {
    num: "01",
    eyebrow: "Serviço 01",
    title: "Venda de Máquinas",
    desc: "Máquinas para a transformação de granitos, mármores, quartzo e cerâmicos. Soluções novas, usadas e recondicionadas para cada fase do processo.",
    cta: { label: "Ver máquinas", href: "/maquinas" },
  },
  {
    num: "02",
    eyebrow: "Serviço 02",
    title: "Venda de Ferramentas",
    desc: "Ferramentas diamantadas e consumíveis para corte, desbaste e polimento de granitos, mármores, quartzo e cerâmicos.",
    cta: { label: "Ver ferramentas", href: "/produtos" },
  },
  {
    num: "03",
    eyebrow: "Serviço 03",
    title: "Suporte Técnico",
    desc: "Manutenção, reparação e assistência técnica às máquinas. Técnicos especializados para manter a sua produção a funcionar.",
    cta: { label: "Pedir assistência", href: "/contactos" },
  },
  {
    num: "04",
    eyebrow: "Serviço 04",
    title: "Formação Técnica",
    desc: "Formação de operadores e equipas técnicas na utilização das máquinas e ferramentas. Tiramos o máximo partido do equipamento com segurança e produtividade.",
    cta: { label: "Falar connosco", href: "/contactos" },
  },
  {
    num: "05",
    eyebrow: "Serviço 05",
    title: "Rechapagem de Discos",
    desc: "Rechapagem de discos diamantados: substituímos os segmentos gastos e devolvemos ao disco a capacidade de corte.",
    cta: { label: "Pedir orçamento", href: "/contactos" },
  },
];

// Services featured on the homepage "Os nossos serviços" block (kept at the original four)
export const HOME_SERVICES = SERVICES.filter((s) => ["01", "02", "03", "04"].includes(s.num));
