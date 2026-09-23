"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Languages, Loader2 } from "lucide-react";
import { autoTranslate, saveTranslations } from "@/app/actions/admin-translate";
import { rawToDisplay, displayToRaw, type Entity, type TranslatableField } from "@/lib/translatable";
import { useConfirm } from "@/components/ui/confirm";

type Vals = Record<string, string>; // field -> display text

const LANGS = [
  { code: "en" as const, label: "Inglês", flag: "EN" },
  { code: "fr" as const, label: "Francês", flag: "FR" },
];

export function TranslationsEditor({
  entity,
  entityId,
  fields,
  pt,
  initial,
  backHref,
}: {
  entity: Entity;
  entityId: string;
  fields: TranslatableField[];
  pt: Record<string, string>; // raw PT values from the DB
  initial: { en: Record<string, string>; fr: Record<string, string> }; // raw stored translations
  backHref: string;
}) {
  const router = useRouter();
  const confirm = useConfirm();

  const toDisplay = React.useCallback(
    (raw: Record<string, string>): Vals => {
      const out: Vals = {};
      for (const f of fields) out[f.field] = rawToDisplay(f.type, raw[f.field]);
      return out;
    },
    [fields],
  );

  const ptDisplay = React.useMemo(() => toDisplay(pt), [toDisplay, pt]);
  const [en, setEn] = React.useState<Vals>(() => toDisplay(initial.en));
  const [fr, setFr] = React.useState<Vals>(() => toDisplay(initial.fr));
  const state = { en: [en, setEn] as const, fr: [fr, setFr] as const };

  const [translating, setTranslating] = React.useState<"en" | "fr" | null>(null);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleTranslate(code: "en" | "fr") {
    setError("");
    setDone(false);
    setTranslating(code);
    // send the raw PT values (JSON for list/specs) to the service
    const ptRaw: Record<string, string> = {};
    for (const f of fields) ptRaw[f.field] = displayToRaw(f.type, ptDisplay[f.field]);
    const res = await autoTranslate(entity, ptRaw, code);
    setTranslating(null);
    if (!res.success) {
      setError(res.error);
      return;
    }
    state[code][1](toDisplay(res.values));
  }

  async function handleSave() {
    if (!(await confirm({ title: "Guardar traduções", message: "Guardar as traduções revistas para EN e FR?", confirmLabel: "Guardar" }))) return;
    setPending(true);
    setError("");
    setDone(false);
    const pack = (v: Vals) => {
      const out: Record<string, string> = {};
      for (const f of fields) out[f.field] = displayToRaw(f.type, v[f.field]);
      return out;
    };
    const res = await saveTranslations(entity, entityId, { en: pack(en), fr: pack(fr) });
    setPending(false);
    if (res.success) {
      setDone(true);
      router.refresh();
    } else {
      setError(res.error ?? "Erro ao guardar.");
    }
  }

  return (
    <div className="max-w-5xl">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-5">
          <CheckCircle2 className="h-4 w-4" /> Traduções guardadas.
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-5">{error}</div>}

      <div className="flex flex-wrap gap-2 mb-6">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => handleTranslate(l.code)}
            disabled={translating !== null}
            className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-black transition-colors disabled:opacity-50"
          >
            {translating === l.code ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
            Traduzir para {l.label}
          </button>
        ))}
        <span className="text-xs text-gray-400 self-center ml-1">Preenche automaticamente — reveja antes de guardar.</span>
      </div>

      <div className="space-y-8">
        {fields.map((f) => {
          const multiline = f.type !== "text";
          return (
            <div key={f.field}>
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{f.label}</div>
              <div className="grid lg:grid-cols-3 gap-3">
                {/* PT reference (read-only) */}
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">PT (original)</div>
                  {multiline ? (
                    <textarea readOnly value={ptDisplay[f.field]} rows={rowsFor(f)} className="w-full border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500 resize-y" />
                  ) : (
                    <input readOnly value={ptDisplay[f.field]} className="w-full border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
                  )}
                </div>
                {LANGS.map((l) => {
                  const [vals, setVals] = state[l.code];
                  const onChange = (val: string) => setVals((prev) => ({ ...prev, [f.field]: val }));
                  return (
                    <div key={l.code}>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{l.flag}</div>
                      {multiline ? (
                        <textarea value={vals[f.field] ?? ""} onChange={(e) => onChange(e.target.value)} rows={rowsFor(f)} className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-y" />
                      ) : (
                        <input value={vals[f.field] ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors" />
                      )}
                    </div>
                  );
                })}
              </div>
              {f.type === "specs" && <p className="text-[11px] text-gray-400 mt-1">Uma linha por especificação, no formato <code>Chave: Valor</code>.</p>}
              {f.type === "lines" && <p className="text-[11px] text-gray-400 mt-1">Uma especificação por linha.</p>}
              {f.type === "list" && <p className="text-[11px] text-gray-400 mt-1">Separe os itens por vírgulas.</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {pending ? "A guardar…" : "Guardar traduções"}
        </button>
      </div>
    </div>
  );
}

function rowsFor(f: TranslatableField): number {
  if (f.field === "body") return 8;
  if (f.type === "specs" || f.type === "list" || f.type === "lines") return 4;
  return 3;
}
