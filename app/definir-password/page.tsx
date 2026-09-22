import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/customer-auth";
import { PasswordForm } from "@/components/customer/password-form";

export const metadata: Metadata = { title: "Definir palavra-passe" };

export default async function DefinirPasswordPage() {
  const session = await getCustomer();
  if (!session) redirect("/entrar");
  // If already changed, no need to be here.
  if (!session.mustChangePassword) redirect("/conta");

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-medium text-black tracking-tight">Defina a sua palavra-passe</h1>
          <p className="text-sm text-gray-500 mt-2">Por segurança, defina uma nova palavra-passe para continuar.</p>
        </div>
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <PasswordForm redirectTo="/conta" />
        </div>
      </div>
    </div>
  );
}
