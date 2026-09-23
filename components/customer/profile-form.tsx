"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/app/actions/customer-profile";
import { useConfirm } from "@/components/ui/confirm";
import { useLang } from "@/lib/i18n";

export interface ProfileInitial {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  taxId: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
}

export function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const { t } = useLang();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const confirm = useConfirm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!(await confirm({ title: t("pf.save"), message: t("pf.confirmMsg"), confirmLabel: t("pf.save") }))) return;
    setPending(true);
    setError("");
    setDone(false);
    const res = await updateProfile(fd);
    setPending(false);
    if (res.success) { setDone(true); setTimeout(() => setDone(false), 4000); }
    else setError(res.error ?? "Erro inesperado.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          <CheckCircle2 className="h-4 w-4" /> {t("pf.saved")}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      <Field label={t("pf.emailLogin")}><input value={initial.email} disabled className="bg-gray-50 text-gray-400" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("pf.name")}><input required name="name" defaultValue={initial.name} /></Field>
        <Field label={t("pf.company")}><input name="company" defaultValue={initial.company ?? ""} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("pf.phone")}><input name="phone" defaultValue={initial.phone ?? ""} /></Field>
        <Field label={t("pf.nif")}><input name="taxId" defaultValue={initial.taxId ?? ""} /></Field>
      </div>
      <Field label={t("pf.address")}><input name="address" defaultValue={initial.address ?? ""} placeholder={t("pf.streetPh")} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("pf.postal")}><input name="postalCode" defaultValue={initial.postalCode ?? ""} placeholder="0000-000" /></Field>
        <Field label={t("pf.city")}><input name="city" defaultValue={initial.city ?? ""} /></Field>
      </div>

      <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
        {pending ? t("pf.saving") : t("pf.save")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: `w-full appearance-none rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors ${(children as React.ReactElement<{ className?: string }>).props.className ?? ""}`,
      })}
    </div>
  );
}
