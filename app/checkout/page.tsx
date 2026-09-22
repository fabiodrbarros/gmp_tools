import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerCheckout } from "@/components/pages/customer-checkout";
import { getCustomer } from "@/lib/customer-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Finalizar encomenda" };

export default async function Page() {
  const c = await getCustomer();
  if (!c) redirect("/entrar");
  if (c.mustChangePassword) redirect("/definir-password");

  const customer = await db.customer.findUnique({ where: { id: c.id } });

  return (
    <CustomerCheckout
      initialAddress={{
        address: customer?.address ?? "",
        postalCode: customer?.postalCode ?? "",
        city: customer?.city ?? "",
      }}
    />
  );
}
