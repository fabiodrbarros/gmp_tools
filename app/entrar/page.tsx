import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomerLoginForm } from "@/components/customer/login-form";
import { getCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage() {
  if (await getCustomer()) redirect("/conta");

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-medium text-black tracking-tight">Área de cliente</h1>
        </div>
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <CustomerLoginForm />
        </div>
        <p className="text-center text-[12px] text-gray-400 mt-6">
          <Link href="/contactos" className="hover:text-black transition-colors">Contacte a GMP</Link>
        </p>
      </div>
    </div>
  );
}
