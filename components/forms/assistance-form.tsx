"use client";

import * as React from "react";
import { submitAssistance } from "@/app/actions/assistance";
import { CheckCircle2 } from "lucide-react";

export function AssistanceForm() {
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await submitAssistance(new FormData(e.currentTarget));
    setPending(false);
    if (res.success) setDone(true);
    else setError(res.error ?? "Erro inesperado.");
  }

  if (done) {
    return (
      <div className="p-12 border border-green-100 bg-green-50 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-green-900 mb-2">Pedido enviado com sucesso</h3>
        <p className="text-green-700">A nossa equipa técnica contacta-o em breve. Obrigado.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Nome *</label>
          <input required name="name" className="w-full h-11 border border-gray-200 px-4 text-sm focus:outline-none focus:border-black transition-colors" placeholder="O seu nome" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Email *</label>
          <input required name="email" type="email" className="w-full h-11 border border-gray-200 px-4 text-sm focus:outline-none focus:border-black transition-colors" placeholder="email@empresa.pt" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Telefone *</label>
          <input required name="phone" type="tel" className="w-full h-11 border border-gray-200 px-4 text-sm focus:outline-none focus:border-black transition-colors" placeholder="+351 000 000 000" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Empresa</label>
          <input name="company" className="w-full h-11 border border-gray-200 px-4 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Nome da empresa" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Tipo de máquina / equipamento *</label>
        <input required name="machineType" className="w-full h-11 border border-gray-200 px-4 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Ex: Thibaut T500, Serra de ponte CNC, Router..." />
      </div>

      <div>
        <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Urgência *</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "NORMAL", label: "Normal", desc: "≤ 48h" },
            { value: "HIGH", label: "Alta", desc: "≤ 24h" },
            { value: "CRITICAL", label: "Crítica", desc: "Máquina parada" },
          ].map((u) => (
            <label key={u.value} className="cursor-pointer">
              <input type="radio" name="urgency" value={u.value} className="sr-only peer" defaultChecked={u.value === "NORMAL"} />
              <div className="border border-gray-200 p-3 text-center peer-checked:border-black peer-checked:bg-black peer-checked:text-white transition-all">
                <div className="text-xs font-medium">{u.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{u.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">Descrição da avaria / pedido *</label>
        <textarea
          required
          name="description"
          rows={5}
          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Descreva o problema com o máximo de detalhe: sintomas, quando começou, o que foi tentado..."
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white text-sm font-semibold py-4 hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {pending ? "A enviar..." : "Enviar pedido de assistência"}
      </button>
    </form>
  );
}
