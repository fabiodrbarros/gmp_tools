import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartPage } from "@/components/pages/cart-page";
import { getCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "Carrinho" };

export default async function Page() {
  const c = await getCustomer();
  if (!c) redirect("/entrar");
  if (c.mustChangePassword) redirect("/definir-password");
  return <CartPage />;
}
