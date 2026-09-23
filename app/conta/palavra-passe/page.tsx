import type { Metadata } from "next";
import { PasswordForm } from "@/components/customer/password-form";
import { getT } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Palavra-passe" };

export default async function ContaPasswordPage() {
  const { t } = await getT();
  return (
    <div className="max-w-xl">
      <h2 className="text-sm font-medium text-black uppercase tracking-wider mb-5">{t("pw.title")}</h2>
      <PasswordForm />
    </div>
  );
}
