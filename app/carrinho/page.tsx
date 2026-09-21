import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartPage } from "@/components/pages/cart-page";
import { getCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "Carrinho" };

export default async function Page() {
  if (!(await getCustomer())) redirect("/entrar");
  return <CartPage />;
}
