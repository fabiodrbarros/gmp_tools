import type { Metadata } from "next";
import { PasswordForm } from "@/components/customer/password-form";

export const metadata: Metadata = { title: "Palavra-passe" };

export default function ContaPasswordPage() {
  return (
    <div className="max-w-xl">
      <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-5">Alterar palavra-passe</h2>
      <PasswordForm />
    </div>
  );
}
