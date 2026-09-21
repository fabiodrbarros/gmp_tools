"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

export interface Tier {
  minQty: number;
  discountPct: number;
}

export function QuantityTiersField({ initial = [] }: { initial?: Tier[] }) {
  const [rows, setRows] = React.useState<Tier[]>(
    initial.length ? initial : [],
  );

  function add() {
    setRows((r) => [...r, { minQty: 0, discountPct: 0 }]);
  }
  function remove(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i));
  }
  function set(i: number, key: keyof Tier, value: number) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  }

  return (
    <div>
      {rows.length > 0 && (
        <div className="border border-gray-200 divide-y divide-gray-100 mb-3">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <span>Quantidade mínima</span>
            <span>Desconto (%)</span>
            <span />
          </div>
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 px-3.5 py-2.5 items-center">
              <input
                type="number"
                min="1"
                step="1"
                value={row.minQty || ""}
                onChange={(e) => set(i, "minQty", Number(e.target.value) || 0)}
                placeholder="10"
                className="w-full appearance-none rounded-none bg-white border border-gray-200 px-2.5 py-1.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <input
                type="number"
                min="0"
                max="90"
                step="1"
                value={row.discountPct || ""}
                onChange={(e) => set(i, "discountPct", Number(e.target.value) || 0)}
                placeholder="5"
                className="w-full appearance-none rounded-none bg-white border border-gray-200 px-2.5 py-1.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Remover escalão">
                <X className="h-4 w-4" />
              </button>
              {/* submitted values */}
              <input type="hidden" name="tierQty" value={row.minQty} />
              <input type="hidden" name="tierPct" value={row.discountPct} />
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={add} className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-black transition-colors">
        <Plus className="h-4 w-4" /> Adicionar escalão
      </button>
      <p className="text-[11px] text-gray-400 mt-2">Ex.: a partir de 10 un. → 5%, a partir de 50 un. → 10%. Somam-se ao desconto do cliente.</p>
    </div>
  );
}
