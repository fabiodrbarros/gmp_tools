import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const CATEGORIES = [
  { name: "Discos Diamantados", slug: "discos-diamantados" },
  { name: "Ferramentas CNC", slug: "ferramentas-cnc" },
  { name: "Frankfurt", slug: "frankfurt" },
  { name: "Polimento", slug: "polimento" },
  { name: "Acessórios", slug: "acessorios" },
];

const BRANDS = ["Distar", "Tyrolit", "Husqvarna", "Alpha", "Braxton"];

const PRODUCTS = [
  { name: "Disco Diamantado Granito Premium 350mm", sku: "DD-GR-350", category: "discos-diamantados", brand: "Distar", price: 189.9, comparePrice: 219.9, featured: true },
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

  let created = 0;
  for (const p of PRODUCTS) {
    const exists = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (exists) continue;
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        sku: p.sku,
        price: p.quoteOnly ? null : p.price,
        comparePrice: p.comparePrice ?? null,
        stock: 10,
        isActive: true,
        isFeatured: !!p.featured,
        quoteOnly: !!p.quoteOnly,
        categoryId: catId[p.category] ?? null,
        brandId: brandId[p.brand] ?? null,
      },
    });
    created++;
  }
  const total = await prisma.product.count();
  console.log(`Seed OK — criados ${created}, total ${total}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
