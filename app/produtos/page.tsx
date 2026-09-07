import type { Metadata } from "next";
import { ProductsPage } from "@/components/pages/products-page";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description: "Ferramentas diamantadas para granitos, mármores, quartzo e cerâmicos. Discos, fresas CNC, Frankfurt e acessórios.",
};

export default function Page() {
  return <ProductsPage />;
}
