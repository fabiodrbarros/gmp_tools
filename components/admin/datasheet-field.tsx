"use client";

import * as React from "react";
import { X, FileText, Upload } from "lucide-react";

function fileName(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
}

export function DatasheetField({ initial = null }: { initial?: string | null }) {
  const [kept, setKept] = React.useState<string | null>(initial);
  const [picked, setPicked] = React.useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPicked(f ? f.name : null);
  }

  return (
    <div>
      {kept && !picked && (
        <div className="flex items-center gap-3 mb-4 border border-gray-200 bg-gray-50 px-4 py-3">
          <FileText className="h-5 w-5 text-red-600 shrink-0" />
          <a href={kept} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-black underline truncate flex-1">
            {fileName(kept)}
          </a>
          <button
            type="button"
            onClick={() => setKept(null)}
            className="text-gray-400 hover:text-red-600 transition-colors shrink-0"
            title="Remover ficha técnica"
          >
            <X className="h-4 w-4" />
          </button>
          {/* keep the existing file unless removed or replaced */}
          <input type="hidden" name="existingDatasheet" value={kept} />
        </div>
      )}

      {picked && (
        <div className="flex items-center gap-3 mb-4 border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
          <FileText className="h-5 w-5 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-600 truncate flex-1">{picked}</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 shrink-0">novo</span>
        </div>
      )}

      <label className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-sm text-gray-600 cursor-pointer hover:border-black transition-colors">
        <Upload className="h-4 w-4" />
        {kept || picked ? "Substituir ficheiro" : "Escolher ficheiro"}
        <input
          type="file"
          name="datasheet"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,application/pdf"
          onChange={onChange}
          className="hidden"
        />
      </label>
      <p className="text-[11px] text-gray-400 mt-2">PDF (recomendado) ou documento. Aparece como transferência na página do produto/máquina.</p>
    </div>
  );
}
