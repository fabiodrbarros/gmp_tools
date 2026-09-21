"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { createMachine, updateMachine } from "@/app/actions/admin-machine";
import { ImagesField } from "@/components/admin/images-field";
import { DatasheetField } from "@/components/admin/datasheet-field";
import { useConfirm } from "@/components/ui/confirm";

export interface MachineInitial {
  id: string;
  name: string;
  label: string | null;
  condition: string;
  category: string | null;
  brand: string | null;
  year: string | null;
  price: number | null;
  shortDescription: string | null;
  description: string | null;
  specs: string[];
  images: string[];
  datasheet: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

export function MachineForm({ machine, categories = [] }: { machine?: MachineInitial; categories?: { slug: string; name: string }[] }) {
  const editing = !!machine;
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const confirm = useConfirm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await confirm({
      title: editing ? "Guardar alterações" : "Criar máquina",
      message: editing ? "Guardar as alterações a esta máquina?" : "Criar esta máquina?",
      confirmLabel: editing ? "Guardar" : "Criar",
    });
    if (!ok) return;
    setPending(true);
    setError("");
    const res = editing ? await updateMachine(machine!.id, fd) : await createMachine(fd);
    setPending(false);
    if (res.success) {
      setDone(true);
      if (editing) setTimeout(() => router.push("/gmp-panel-admin/maquinas"), 700);
      else { formRef.current?.reset(); setTimeout(() => setDone(false), 4000); }
    } else setError(res.error ?? "Erro inesperado.");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl">
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6">
          <CheckCircle2 className="h-4 w-4" /> {editing ? "Alterações guardadas." : "Máquina criada com sucesso."}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

      <Section title="Identificação">
        <Field label="Nome *"><input required name="name" defaultValue={machine?.name} placeholder="Thibaut T500 R" /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tipo / etiqueta"><input name="label" defaultValue={machine?.label ?? ""} placeholder="Ponteadora automática" /></Field>
          <SelectField
            label="Estado"
            name="condition"
            defaultValue={machine?.condition ?? "NEW"}
            options={[
              { value: "NEW", label: "Nova" },
              { value: "REFURBISHED", label: "Recondicionada" },
              { value: "USED", label: "Usada" },
            ]}
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <SelectField
            label="Categoria"
            name="category"
            defaultValue={machine?.category ?? ""}
            placeholder="— Sem categoria —"
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          />
          <Field label="Marca"><input name="brand" defaultValue={machine?.brand ?? ""} placeholder="Thibaut" /></Field>
          <Field label="Ano"><input name="year" defaultValue={machine?.year ?? ""} placeholder="2018" /></Field>
        </div>
      </Section>

      <Section title="Imagens">
        <ImagesField initial={machine?.images ?? []} />
      </Section>

      <Section title="Ficha técnica">
        <DatasheetField initial={machine?.datasheet ?? null} />
      </Section>

      <Section title="Descrição">
        <Field label="Descrição curta"><input name="shortDescription" defaultValue={machine?.shortDescription ?? ""} placeholder="Resumo de uma linha" /></Field>
        <Field label="Descrição completa"><textarea name="description" rows={4} defaultValue={machine?.description ?? ""} placeholder="Detalhes da máquina..." /></Field>
        <Field label="Especificações (uma por linha)">
          <textarea name="specifications" rows={5} defaultValue={machine?.specs.join("\n") ?? ""} placeholder={"Potência 15kW\nMesa 3200×2000mm\nCNC integrado"} />
        </Field>
      </Section>

      <Section title="Preço & opções">
        <Field label="Preço (€) — deixe vazio para «sob consulta»"><input name="price" type="number" step="1" min="0" defaultValue={machine?.price ?? ""} placeholder="38000" /></Field>
        <div className="flex flex-wrap gap-6">
          <Check name="isActive" label="Activa" defaultChecked={machine ? machine.isActive : true} />
          <Check name="isFeatured" label="Destaque" defaultChecked={machine?.isFeatured} />
        </div>
      </Section>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
          {pending ? "A guardar..." : editing ? "Guardar alterações" : "Criar máquina"}
        </button>
        <Link href="/gmp-panel-admin/maquinas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
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

function SelectField({ label, name, defaultValue, options, placeholder }: { label: string; name: string; defaultValue?: string; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-none border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-red-600" />
      {label}
    </label>
  );
}
