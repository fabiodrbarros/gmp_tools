"use client";

import * as React from "react";
import { submitQuote } from "@/app/actions/quote";
import { CheckCircle2 } from "lucide-react";

export function QuoteForm({ productName, productSku }: { productName?: string; productSku?: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    if (productName) fd.set("productName", productName);
    if (productSku) fd.set("productSku", productSku);
    const res = await submitQuote(fd);
    setPending(false);
    if (res.success) setDone(true);
    else setError(res.error ?? "Erro inesperado.");
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 text-sm text-green-800">
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        Mensagem enviada com sucesso. Entraremos em contacto brevemente.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-black text-white text-sm font-semibold py-3.5 hover:bg-red-600 transition-colors"
      >
        Enviar mensagem
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 p-5 space-y-3">
      <div className="text-sm font-medium mb-4">Enviar mensagem</div>
      {productName && (
        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-2 mb-2">
          {productName} · {productSku}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <input required name="name" placeholder="Nome *" className="h-10 border border-gray-200 px-3 text-sm focus:outline-none focus:border-black" />
        <input required name="email" type="email" placeholder="Email *" className="h-10 border border-gray-200 px-3 text-sm focus:outline-none focus:border-black" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="phone" placeholder="Telefone" className="h-10 border border-gray-200 px-3 text-sm focus:outline-none focus:border-black" />
        <input name="company" placeholder="Empresa" className="h-10 border border-gray-200 px-3 text-sm focus:outline-none focus:border-black" />
      </div>
      <textarea required name="message" placeholder="Mensagem *" rows={3} className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="flex-1 bg-black text-white text-sm font-semibold py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
          {pending ? "A enviar..." : "Enviar mensagem"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 text-sm text-gray-500 border border-gray-200 hover:border-black transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
