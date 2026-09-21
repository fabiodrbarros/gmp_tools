"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { createCustomer, updateCustomer } from "@/app/actions/admin-customer";
import { QuantityTiersField, type Tier } from "@/components/admin/quantity-tiers-field";
import { useConfirm } from "@/components/ui/confirm";

export interface CustomerInitial {
  id: string;
  email: string;
  name: string;
  company: string | null;
  phone: string | null;
  taxId: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  discountPct: number;
  isActive: boolean;
  categoryDiscounts: { categoryId: string; discountPct: number }[];
  quantityTiers: Tier[];
}

export function CustomerForm({
  customer,
  categories = [],
}: {
  customer?: CustomerInitial;
  categories?: { id: string; name: string }[];
}) {
  const editing = !!customer;
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const confirm = useConfirm();

  const catMap = new Map((customer?.categoryDiscounts ?? []).map((d) => [d.categoryId, d.discountPct]));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await confirm({
      title: editing ? "Guardar alterações" : "Criar cliente",
      message: editing ? "Guardar as alterações a este cliente?" : "Criar esta conta de cliente?",
      confirmLabel: editing ? "Guardar" : "Criar",
    });
    if (!ok) return;
    setPending(true);
    setError("");
    const res = editing ? await updateCustomer(customer!.id, fd) : await createCustomer(fd);
    setPending(false);
    if (res.success) {
      setDone(true);
      if (editing) setTimeout(() => router.push("/gmp-panel-admin/clientes"), 700);
      else { formRef.current?.reset(); setTimeout(() => setDone(false), 4000); }
    } else setError(res.error ?? "Erro inesperado.");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl">
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6">
          <CheckCircle2 className="h-4 w-4" /> {editing ? "Alterações guardadas." : "Cliente criado com sucesso."}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

      <Section title="Dados de acesso">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome *"><input required name="name" defaultValue={customer?.name} placeholder="João Silva" /></Field>
          <Field label="Email * (login)"><input required name="email" type="email" defaultValue={customer?.email} placeholder="cliente@empresa.pt" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Empresa"><input name="company" defaultValue={customer?.company ?? ""} placeholder="Empresa, Lda." /></Field>
          <Field label="Telefone"><input name="phone" defaultValue={customer?.phone ?? ""} placeholder="+351 ..." /></Field>
        </div>
        <Field label={editing ? "Nova palavra-passe (deixar vazio para manter)" : "Palavra-passe *"}>
          <input name="password" type="text" autoComplete="new-password" placeholder={editing ? "••••••" : "mínimo 6 caracteres"} />
        </Field>
      </Section>

      <Section title="Morada & faturação">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="NIF"><input name="taxId" defaultValue={customer?.taxId ?? ""} /></Field>
          <Field label="Morada"><input name="address" defaultValue={customer?.address ?? ""} placeholder="Rua, número" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Código postal"><input name="postalCode" defaultValue={customer?.postalCode ?? ""} placeholder="0000-000" /></Field>
          <Field label="Localidade"><input name="city" defaultValue={customer?.city ?? ""} /></Field>
        </div>
      </Section>

      <Section title="Descontos">
        <Field label="Desconto geral (%)">
          <input name="discountPct" type="number" min="0" max="90" step="1" defaultValue={customer?.discountPct ?? 0} />
        </Field>
        {categories.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Desconto por categoria (sobrepõe o geral)</label>
            <div className="border border-gray-200 divide-y divide-gray-100">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
                  <span className="text-sm text-gray-700">{c.name}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      name={`catDisc_${c.id}`}
                      type="number"
                      min="0"
                      max="90"
                      step="1"
                      defaultValue={catMap.get(c.id) ?? ""}
                      placeholder="0"
                      className="w-20 appearance-none rounded-none bg-white border border-gray-200 px-2.5 py-1.5 text-sm text-right focus:outline-none focus:border-black transition-colors"
                    />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Vazio = usa o desconto geral.</p>
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Desconto por quantidade (soma-se ao desconto acima)</label>
          <QuantityTiersField initial={customer?.quantityTiers ?? []} />
        </div>
      </Section>

      <Section title="Estado">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input type="checkbox" name="isActive" defaultChecked={customer ? customer.isActive : true} className="h-4 w-4 accent-red-600" />
          Conta activa (pode iniciar sessão)
        </label>
      </Section>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
          {pending ? "A guardar..." : editing ? "Guardar alterações" : "Criar cliente"}
        </button>
        <Link href="/gmp-panel-admin/clientes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 p-6 mb-5 space-y-4">
      <h2 className="text-[11px] font-medium tracking-widest text-gray-400 uppercase">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: "w-full appearance-none rounded-none bg-white border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors",
      })}
    </div>
  );
}
