"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { createNews, updateNews } from "@/app/actions/admin-news";
import { ImagesField } from "@/components/admin/images-field";

export interface NewsInitial {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  date: string; // yyyy-mm-dd
  readMin: number;
  images: string[];
  isPublished: boolean;
}

export function NewsForm({ news }: { news?: NewsInitial }) {
  const editing = !!news;
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
    const res = editing ? await updateNews(news!.id, fd) : await createNews(fd);
    setPending(false);
    if (res.success) {
      setDone(true);
      if (editing) {
        setTimeout(() => router.push("/gmp-panel-admin/noticias"), 700);
      } else {
        formRef.current?.reset();
        setTimeout(() => setDone(false), 4000);
      }
    } else {
      setError(res.error ?? "Erro inesperado.");
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-3xl">
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6">
          <CheckCircle2 className="h-4 w-4" /> {editing ? "Alterações guardadas." : "Notícia criada com sucesso."}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

      <Section title="Identificação">
        <Field label="Título *"><input required name="title" defaultValue={news?.title} placeholder="Nova geração Thibaut: o que muda na T500 R" /></Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Categoria *"><input required name="category" defaultValue={news?.category ?? ""} placeholder="Máquinas, Guias, Assistência…" /></Field>
          <Field label="Data"><input name="date" type="date" defaultValue={news?.date ?? today} /></Field>
          <Field label="Minutos de leitura"><input name="readMin" type="number" min="1" defaultValue={news?.readMin ?? 3} /></Field>
        </div>
      </Section>

      <Section title="Imagem">
        <ImagesField initial={news?.images ?? []} />
      </Section>

      <Section title="Conteúdo">
        <Field label="Resumo *"><textarea required name="excerpt" rows={2} defaultValue={news?.excerpt ?? ""} placeholder="Uma ou duas frases que resumem a notícia (aparece nas listagens)." /></Field>
        <Field label="Texto"><textarea name="body" rows={10} defaultValue={news?.body ?? ""} placeholder={"Corpo do artigo.\n\nSepare os parágrafos com uma linha em branco."} /></Field>
        <p className="text-[11px] text-gray-400">Separe os parágrafos com uma linha em branco.</p>
      </Section>

      <Section title="Opções">
        <Check name="isPublished" label="Publicada" defaultChecked={news ? news.isPublished : true} />
      </Section>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
          {pending ? "A guardar..." : editing ? "Guardar alterações" : "Criar notícia"}
        </button>
        <Link href="/gmp-panel-admin/noticias" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
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

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-red-600" />
      {label}
    </label>
  );
}
