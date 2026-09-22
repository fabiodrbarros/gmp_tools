"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";
import { createTicket } from "@/app/actions/support";
import { useConfirm } from "@/components/ui/confirm";

export function NewTicketForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [files, setFiles] = React.useState<string[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);
  const confirm = useConfirm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!(await confirm({ title: "Abrir ticket", message: "Enviar este pedido de suporte à GMP?", confirmLabel: "Abrir ticket" }))) return;
    setPending(true);
    setError("");
    const res = await createTicket(fd);
    setPending(false);
    if (res.success) {
      formRef.current?.reset();
      setFiles([]);
      router.push(`/conta/suporte/${res.ticketId}`);
    } else setError(res.error);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-medium text-black">Abrir novo ticket</h3>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Assunto</label>
        <input required name="subject" placeholder="Ex.: Ponteadora não arranca" className="w-full rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descrição do problema</label>
        <textarea required name="body" rows={4} placeholder="Descreva o que se passa, mensagens de erro, o que já tentou…" className="w-full rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
      </div>
      <div>
        <label className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-sm text-gray-600 cursor-pointer hover:border-black transition-colors">
          <Paperclip className="h-4 w-4" /> Anexar ficheiros
          <input type="file" name="attachments" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} className="hidden" />
        </label>
        {files.length > 0 && <p className="text-[11px] text-gray-400 mt-2">{files.join(", ")}</p>}
      </div>
      <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
        {pending ? "A enviar..." : "Abrir ticket"}
      </button>
    </form>
  );
}
