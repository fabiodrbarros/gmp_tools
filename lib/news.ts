import { db } from "@/lib/db";
import { parseImages } from "@/lib/upload";

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO
  readMin: number;
  excerpt: string;
  body: string[];
  image?: string;
}

function parseBody(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

type NewsRow = {
  slug: string;
  title: string;
  category: string;
  date: Date;
  readMin: number;
  excerpt: string;
  body: string | null;
  images: string | null;
};

function toArticle(n: NewsRow): Article {
  return {
    slug: n.slug,
    title: n.title,
    category: n.category,
    date: new Date(n.date).toISOString(),
    readMin: n.readMin,
    excerpt: n.excerpt,
    body: parseBody(n.body),
    image: parseImages(n.images)[0],
  };
}

export async function listArticles(): Promise<Article[]> {
  try {
    const rows = await db.news.findMany({ where: { isPublished: true }, orderBy: { date: "desc" } });
    return rows.map(toArticle);
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const n = await db.news.findFirst({ where: { slug, isPublished: true } });
    return n ? toArticle(n) : null;
  } catch {
    return null;
  }
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
}
