import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:prisma/dev.db" }) });

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const CATEGORIES = [
  { name: "Discos Diamantados", slug: "discos-diamantados" },
  { name: "Ferramentas CNC", slug: "ferramentas-cnc" },
  { name: "Frankfurt", slug: "frankfurt" },
  { name: "Polimento", slug: "polimento" },
  { name: "Acessórios", slug: "acessorios" },
];

const BRANDS = ["Distar", "Tyrolit", "Husqvarna", "Alpha", "Braxton", "Thibaut", "GMF", "SCM"];

const PRODUCTS = [
  { name: "Disco Diamantado Granito Premium 350mm", sku: "DD-GR-350", category: "discos-diamantados", brand: "Distar", price: 189.9, comparePrice: 219.9 },
  { name: "Disco Diamantado Mármore 400mm", sku: "DD-MRM-400", category: "discos-diamantados", brand: "Distar", price: 245.0 },
  { name: "Disco Cerâmica Turbo 230mm", sku: "DD-CER-230", category: "discos-diamantados", brand: "Tyrolit", price: 54.9 },
  { name: "Disco Diamantado Betão Segmentado 300mm", sku: "DD-BET-300", category: "discos-diamantados", brand: "Husqvarna", price: 98.0 },
  { name: "Fresa CNC Perfil Ogiva 20mm", sku: "FR-CNC-OG-20", category: "ferramentas-cnc", brand: "Alpha", price: 145.0 },
  { name: "Fresa CNC Perfil Meia-Cana 30mm", sku: "FR-CNC-MC-30", category: "ferramentas-cnc", brand: "Alpha", price: 165.0 },
  { name: "Router CNC Diamantado 12mm", sku: "RT-CNC-12", category: "ferramentas-cnc", brand: "Braxton", price: 89.0 },
  { name: "Frankfurt Resinada Mármore 140g", sku: "FR-MRM-140", category: "frankfurt", brand: "Alpha", price: 38.5 },
  { name: "Frankfurt Metal Granito 140g", sku: "FR-GR-140", category: "frankfurt", brand: "Alpha", price: 42.0 },
  { name: "Mó Polir CNC Granito D130", sku: "MO-CNC-GR-130", category: "polimento", brand: "Alpha", price: null, quoteOnly: true },
  { name: "Polidor Orbital Diamantado 125mm", sku: "PO-ORB-125", category: "polimento", brand: "Tyrolit", price: 67.5 },
  { name: "Broca Diamantada Seca 35mm", sku: "BR-DIA-35", category: "acessorios", brand: "Husqvarna", price: 72.0 },
];

const MACHINES = [
  { name: "Thibaut T500 R", slug: "thibaut-t500-r", label: "Ponteadora automática", brand: "Thibaut", condition: "NEW", category: "ponteadoras", isFeatured: true, shortDescription: "A ponteadora de granito mais vendida do mundo. Automática, fiável, altamente produtiva.", specifications: JSON.stringify(["Comprimento máx. 3500mm", "Largura máx. 2000mm", "Potência 15kW", "CNC integrado"]) },
  { name: "Thibaut T300", slug: "thibaut-t300", label: "Ponteadora compacta", brand: "Thibaut", condition: "NEW", category: "ponteadoras", isFeatured: true, shortDescription: "Solução compacta e fiável para ponteamento de granito e mármore em espaços reduzidos.", specifications: JSON.stringify(["Comprimento máx. 2500mm", "Potência 11kW", "Sistema de refrigeração", "Alta precisão"]) },
  { name: "CNC Bridge Saw 5 Eixos", slug: "cnc-bridge-saw", label: "Serra de ponte CNC", brand: "GMF", condition: "NEW", category: "corte-cnc", shortDescription: "Serra de ponte CNC 5 eixos para corte e entalhe de pedra com máxima precisão dimensional.", specifications: JSON.stringify(["5 eixos de movimento", "Controlo CNC", "Mesa 3200×2000mm", "Corte oblíquo"]) },
  { name: "Thibaut T500 R", slug: "thibaut-t500-r-recondicionada", label: "Recondicionada", brand: "Thibaut", condition: "REFURBISHED", category: "ponteadoras", year: "2018", price: 38000, shortDescription: "Ponteadora Thibaut T500 R recondicionada integralmente pelos nossos técnicos, com garantia de 12 meses.", specifications: JSON.stringify(["Ano 2018 · ≈ 4.200h", "Calibração CNC completa", "Garantia 12 meses", "Documentação actualizada"]) },
  { name: "Serra de Ponte CNC", slug: "serra-ponte-cnc-usada", label: "Usada", brand: "GMF", condition: "USED", category: "corte-cnc", year: "2016", price: 22000, shortDescription: "Serra de ponte CNC em bom estado, verificada e certificada pela nossa equipa técnica.", specifications: JSON.stringify(["Ano 2016", "Mesa 3200×2000mm", "Garantia 6 meses", "Inspeccionada"]) },
  { name: "Router CNC 3 Eixos", slug: "router-cnc-3-eixos-usada", label: "Recondicionada", brand: "SCM", condition: "REFURBISHED", category: "corte-cnc", year: "2019", price: 28500, shortDescription: "Router CNC 3 eixos recondicionado, electrónica actualizada e novos fusos e guias lineares.", specifications: JSON.stringify(["Ano 2019", "3 eixos (XYZ)", "Garantia 12 meses", "Electrónica nova"]) },
];

const NEWS = [
  { slug: "nova-geracao-thibaut-t500-r", title: "Nova geração Thibaut: o que muda na T500 R", category: "Máquinas", date: new Date("2026-05-28"), readMin: 4, excerpt: "A ponteadora de granito mais vendida do mundo recebe melhorias no CNC, na refrigeração e na produtividade. Fizemos o ponto da situação.", body: ["A Thibaut T500 R mantém-se como referência mundial no ponteamento automático de granito. A nova geração introduz um controlo CNC mais rápido, com ciclos de trabalho optimizados e menor consumo energético.", "Entre as principais novidades está um sistema de refrigeração revisto, que prolonga a vida das ferramentas e reduz paragens, e uma interface de operador mais intuitiva, que encurta o tempo de formação.", "Na GMP Tools garantimos instalação, formação e assistência técnica em todo o território nacional. Contacte-nos para uma demonstração."].join("\n\n") },
  { slug: "como-escolher-disco-diamantado-granito", title: "Como escolher o disco diamantado certo para granito", category: "Guias", date: new Date("2026-04-15"), readMin: 5, excerpt: "Diâmetro, tipo de segmento, ligante e velocidade de corte. Um guia prático para maximizar rendimento e durabilidade.", body: ["A escolha do disco diamantado certo depende de três factores: o material a cortar, a máquina utilizada e o acabamento pretendido. Para granito, a dureza do segmento e a concentração de diamante são determinantes.", "Discos de segmento alto rendem mais em cortes profundos e prolongados, enquanto os de banda contínua oferecem acabamentos mais limpos em peças delicadas. A velocidade periférica recomendada deve ser sempre respeitada para evitar desgaste prematuro.", "Em caso de dúvida, a nossa equipa técnica analisa o seu processo e recomenda a ferramenta ideal. O objectivo é simples: mais metros de corte por disco e menos custo por peça."].join("\n\n") },
  { slug: "manutencao-preventiva-ponteadora", title: "Manutenção preventiva: prolongue a vida da sua ponteadora", category: "Assistência", date: new Date("2026-03-10"), readMin: 3, excerpt: "Pequenas rotinas que evitam grandes avarias. As verificações essenciais para manter a sua máquina sempre operacional.", body: ["A manutenção preventiva é o investimento com melhor retorno numa unidade de transformação de granitos, mármores, quartzo e cerâmicos. Verificações regulares dos sistemas hidráulicos, lubrificação e calibração evitam paragens dispendiosas.", "Recomendamos um plano de manutenção programada, com intervenções periódicas calendarizadas e substituição atempada de consumíveis. Os nossos técnicos deslocam-se às suas instalações.", "Com máquina parada, cada hora conta. A nossa equipa responde de imediato — fale connosco para definir o plano adequado ao seu equipamento."].join("\n\n") },
  { slug: "frankfurt-resinada-vs-metalica", title: "Polimento automático: Frankfurt resinada vs metálica", category: "Guias", date: new Date("2026-02-22"), readMin: 4, excerpt: "Quando usar cada tipo de abrasivo para obter o melhor brilho em mármore e granito, sem comprometer a produtividade.", body: ["As Frankfurt metálicas são indicadas para as primeiras fases de desbaste, removendo material rapidamente. As resinadas entram nas fases de afinação e lustro, conferindo o brilho final à superfície.", "A sequência de grãos correcta é essencial: saltar etapas compromete o acabamento e desgasta os abrasivos mais finos. O ajuste da pressão e da velocidade da linha de polimento completa a equação.", "Trabalhamos com as principais marcas do mercado e ajudamos a definir a sequência ideal para o seu material e linha de produção."].join("\n\n") },
  { slug: "maquinas-usadas-certificadas", title: "Máquinas usadas certificadas: vale a pena?", category: "Equipamento", date: new Date("2026-01-18"), readMin: 3, excerpt: "Equipamento recondicionado pode ser a porta de entrada no segmento CNC. O que verificar antes de comprar.", body: ["Uma máquina usada certificada permite aceder a tecnologia comprovada com um investimento muito inferior ao de uma máquina nova. A chave está na origem e na revisão.", "Todo o equipamento usado da GMP Tools passa por inspecção técnica completa, substituição de componentes de desgaste e teste de funcionamento antes de ser disponibilizado, com garantia incluída.", "Consulte a nossa selecção de máquinas usadas e recondicionadas — ou diga-nos o que procura e encontramos a solução certa."].join("\n\n") },
];

async function main() {
  const catId = {};
  for (const c of CATEGORIES) {
    const r = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    catId[c.slug] = r.id;
  }
  const brandId = {};
  for (const b of BRANDS) {
    const r = await prisma.brand.upsert({ where: { slug: slugify(b) }, update: {}, create: { name: b, slug: slugify(b) } });
    brandId[b] = r.id;
  }

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name, slug: slugify(p.name), sku: p.sku,
        price: p.quoteOnly ? null : p.price ?? null,
        comparePrice: p.comparePrice ?? null,
        quoteOnly: !!p.quoteOnly, stock: 10, isActive: true,
        categoryId: catId[p.category], brandId: brandId[p.brand],
      },
    });
  }

  for (const m of MACHINES) {
    await prisma.machine.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        name: m.name, slug: m.slug, label: m.label, condition: m.condition, category: m.category,
        year: m.year ?? null, price: m.price ?? null, isFeatured: !!m.isFeatured, isActive: true,
        shortDescription: m.shortDescription, specifications: m.specifications, brandId: brandId[m.brand],
      },
    });
  }

  for (const n of NEWS) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {},
      create: { ...n, isPublished: true },
    });
  }

  const [pc, mc, nc] = await Promise.all([prisma.product.count(), prisma.machine.count(), prisma.news.count()]);
  console.log(`Seed OK — ${pc} produtos, ${mc} máquinas, ${nc} notícias.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
