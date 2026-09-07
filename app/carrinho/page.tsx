import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartPage } from "@/components/pages/cart-page";
import { SHOP_ENABLED } from "@/lib/site";

export const metadata: Metadata = { title: "Carrinho" };

export default function Page() {
  if (!SHOP_ENABLED) redirect("/produtos");
  return <CartPage />;
}
