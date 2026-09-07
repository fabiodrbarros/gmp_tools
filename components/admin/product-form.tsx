"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { createProduct, updateProduct } from "@/app/actions/admin-product";
import { ImagesField } from "@/components/admin/images-field";

export interface ProductInitial {
  id: string;
  name: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  comparePrice: number | null;
  stock: number;
  category: string | null;
  brand: string | null;
  materials: string;
  specsText: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  quoteOnly: boolean;
}

export function ProductForm({ product, categories = [] }: { product?: ProductInitial; categories?: { name: string }[] }) {
  const editing = !!product;
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = editing ? await updateProduct(product!.id, fd) : await createProduct(fd);
    setPending(false);
    if (res.success) {
      setDone(true);
      if (editing) {
        setTimeout(() => router.push("/gmp-panel-admin/produtos"), 700);
      } else {
        formRef.current?.reset();
        setTimeout(() => setDone(false), 4000);
      }
    } else {
      setError(res.error ?? "Erro inesperado.");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl">
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6">
          <CheckCircle2 className="h-4 w-4" /> {editing ? "Alterações guardadas." : "Produto criado com sucesso."}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

      <Section title="Identificação">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome *"><input required name="name" defaultValue={product?.name} placeholder="Disco Diamantado Granito 350mm" /></Field>
          <Field label="SKU *"><input required name="sku" defaultValue={product?.sku ?? ""} placeholder="DISC-350-GRA" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Categoria" name="category" defaultValue={product?.category ?? ""} options={categories.map((c) => ({ value: c.name, label: c.name }))} />
          <Field label="Marca"><input name="brand" defaultValue={product?.brand ?? ""} placeholder="Distar" /></Field>
        </div>
      </Section>

      <Section title="Imagens">
        <ImagesField initial={product?.images ?? []} />
      </Section>

      <Section title="Descrição">
        <Field label="Descrição curta"><input name="shortDescription" defaultValue={product?.shortDescription ?? ""} placeholder="Resumo de uma linha" /></Field>
        <Field label="Descrição completa"><textarea name="description" rows={5} defaultValue={product?.description ?? ""} placeholder="Detalhes, aplicações, materiais..." /></Field>
      </Section>

      <Section title="Especificações técnicas">
        <Field label="Especificações">
          <textarea name="specs" rows={5} defaultValue={product?.specsText ?? ""} placeholder={"Uma por linha, no formato Chave: Valor\nDiâmetro: 350 mm\nEspessura de corte: 3,0 mm\nVelocidade máx.: 3.000 RPM"} />
        </Field>
        <p className="text-[11px] text-gray-400">Uma especificação por linha, no formato <span className="font-mono">Chave: Valor</span>. Aparecem na tabela da página do produto.</p>
      </Section>

      <Section title="Materiais">
        <Field label="Materiais compatíveis">
          <input name="materials" defaultValue={product?.materials ?? ""} placeholder="Granito, Quartzite, Gneiss, Pedra dura" />
        </Field>
        <p className="text-[11px] text-gray-400">Separados por vírgula. Aparecem como etiquetas na página do produto.</p>
      </Section>

      <Section title="Preço & stock">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Preço (€)"><input name="price" type="number" step="0.01" min="0" defaultValue={product?.price ?? ""} placeholder="189.90" /></Field>
          <Field label="Preço anterior (€)"><input name="comparePrice" type="number" step="0.01" min="0" defaultValue={product?.comparePrice ?? ""} placeholder="219.90" /></Field>
          <Field label="Stock"><input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} /></Field>
        </div>
      </Section>

      <Section title="Opções">
        <div className="flex flex-wrap gap-6">
          <Check name="isActive" label="Activo" defaultChecked={product ? product.isActive : true} />
          <Check name="isFeatured" label="Destaque" defaultChecked={product?.isFeatured} />
          <Check name="quoteOnly" label="Apenas sob consulta (sem preço)" defaultChecked={product?.quoteOnly} />
        </div>
      </Section>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
          {pending ? "A guardar..." : editing ? "Guardar alterações" : "Criar produto"}
        </button>
        <Link href="/gmp-panel-admin/produtos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
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

function SelectField({ label, name, defaultValue, options }: { label: string; name: string; defaultValue?: string; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-none border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
      >
        <option value="">— Sem categoria —</option>
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
