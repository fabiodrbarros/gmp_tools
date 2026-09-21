"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/app/actions/customer-profile";
import { useConfirm } from "@/components/ui/confirm";

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
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const confirm = useConfirm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!(await confirm({ title: "Guardar dados", message: "Guardar as alterações aos seus dados?", confirmLabel: "Guardar" }))) return;
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
          <CheckCircle2 className="h-4 w-4" /> Dados guardados.
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      <Field label="Email (login)"><input value={initial.email} disabled className="bg-gray-50 text-gray-400" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome *"><input required name="name" defaultValue={initial.name} /></Field>
        <Field label="Empresa"><input name="company" defaultValue={initial.company ?? ""} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Telefone"><input name="phone" defaultValue={initial.phone ?? ""} /></Field>
        <Field label="NIF"><input name="taxId" defaultValue={initial.taxId ?? ""} /></Field>
      </div>
      <Field label="Morada"><input name="address" defaultValue={initial.address ?? ""} placeholder="Rua, número" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Código postal"><input name="postalCode" defaultValue={initial.postalCode ?? ""} placeholder="0000-000" /></Field>
        <Field label="Localidade"><input name="city" defaultValue={initial.city ?? ""} /></Field>
      </div>

      <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
        {pending ? "A guardar..." : "Guardar dados"}
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
