import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { ProfileForm } from "@/components/customer/profile-form";

export const metadata: Metadata = { title: "Os meus dados" };

export default async function ContaDadosPage() {
  const session = await getCustomer();
  if (!session) redirect("/entrar");
  const customer = await db.customer.findUnique({ where: { id: session.id } });
  if (!customer) redirect("/entrar");

  return (
    <div className="max-w-xl">
      <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-5">Os meus dados</h2>
      <ProfileForm
        initial={{
          name: customer.name,
          email: customer.email,
          company: customer.company,
          phone: customer.phone,
          taxId: customer.taxId,
          address: customer.address,
          postalCode: customer.postalCode,
          city: customer.city,
        }}
      />
    </div>
  );
}
