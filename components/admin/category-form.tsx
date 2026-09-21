"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createCategory } from "@/app/actions/admin-category";
import { useConfirm } from "@/components/ui/confirm";

export function CategoryForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const confirm = useConfirm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!(await confirm({ title: "Criar categoria", message: "Criar esta categoria?", confirmLabel: "Criar" }))) return;
    setPending(true);
    setError("");
    const res = await createCategory(fd);
    setPending(false);
    if (res.success) {
      formRef.current?.reset();
      router.refresh();
    } else setError(res.error ?? "Erro inesperado.");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-end gap-3">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome da categoria</label>
        <input required name="name" placeholder="Ex.: Discos Diamantados" className="w-full rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo</label>
        <select name="kind" defaultValue="PRODUCT" className="w-full rounded-none border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors sm:w-44">
          <option value="PRODUCT">Produto</option>
          <option value="MACHINE">Máquina</option>
        </select>
      </div>
      <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-600 transition-colors disabled:opacity-50">
        <Plus className="h-4 w-4" /> {pending ? "A criar..." : "Criar"}
      </button>
      {error && <p className="text-sm text-red-600 w-full">{error}</p>}
    </form>
  );
}
