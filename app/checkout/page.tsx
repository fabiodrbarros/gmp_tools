import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { SHOP_ENABLED } from "@/lib/site";

export const metadata: Metadata = { title: "Finalizar Encomenda" };

export default function Page() {
  if (!SHOP_ENABLED) redirect("/produtos");
  return <CheckoutPage />;
}
