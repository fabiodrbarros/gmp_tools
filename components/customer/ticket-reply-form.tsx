"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Send } from "lucide-react";
import { replyTicket } from "@/app/actions/support";

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [files, setFiles] = React.useState<string[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    const res = await replyTicket(ticketId, fd);
    setPending(false);
    if (res.success) {
      formRef.current?.reset();
      setFiles([]);
      router.refresh();
    } else setError(res.error);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="border border-gray-200 p-4 space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">{error}</div>}
      <textarea name="body" rows={3} placeholder="Escreva a sua mensagem…" className="w-full rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
      <div className="flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-black transition-colors">
          <Paperclip className="h-4 w-4" /> Anexar
          <input type="file" name="attachments" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} className="hidden" />
          {files.length > 0 && <span className="text-[11px] text-gray-400">({files.length})</span>}
        </label>
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-2.5 hover:bg-red-600 transition-colors disabled:opacity-50">
          <Send className="h-4 w-4" /> {pending ? "A enviar..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}
