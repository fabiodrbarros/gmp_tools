import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerCheckout } from "@/components/pages/customer-checkout";
import { getCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "Finalizar encomenda" };

export default async function Page() {
  if (!(await getCustomer())) redirect("/entrar");
  return <CustomerCheckout />;
}
