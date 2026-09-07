// Loja online (carrinho, adicionar ao carrinho, checkout/pagamentos).
// Desligada por agora — o site funciona como catálogo + pedido de orçamento.
// Basta pôr a true para reactivar toda a loja.
export const SHOP_ENABLED = false;

// Central site/contact data — verified from https://gmp.pt
export const SITE = {
  name: "GMP Tools",
  legalName: "GMP-Tools",
  tagline: "Ferramentas diamantadas, máquinas CNC e soluções para granitos, mármores, quartzo e cerâmicos.",
  phone: "+351 965 068 692",
  phoneHref: "+351965068692",
  phoneNote: "Chamada para rede móvel nacional",
  email: "geral@gmp.pt",
  address: {
    street: "Rua do Barreiro",
    postal: "4730-590 Turiz",
  },
  hours: "Segunda a Sábado · 09:00–19:00",
  freeShippingThreshold: 300,
  social: {
    facebook: "https://www.facebook.com/gmptoolspt",
    instagram: "https://www.instagram.com/gmptools/",
  },
} as const;

export const NAV = [
  { num: "01", label: "Produtos", href: "/produtos" },
  { num: "02", label: "Máquinas", href: "/maquinas" },
  { num: "03", label: "Serviços", href: "/servicos" },
  { num: "04", label: "Sobre nós", href: "/sobre" },
  { num: "05", label: "Contactos", href: "/contactos" },
] as const;
