"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (opts?: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = React.createContext<ConfirmFn>(async () => true);

export function useConfirm() {
  return React.useContext(ConfirmCtx);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<{ opts: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = React.useCallback<ConfirmFn>((opts = {}) => {
    return new Promise<boolean>((resolve) => setState({ opts, resolve }));
  }, []);

  const close = React.useCallback((v: boolean) => {
    setState((s) => { s?.resolve(v); return null; });
  }, []);

  React.useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  const o = state?.opts;

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => close(false)} />
            <motion.div
              className="relative bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-sm p-7"
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
            >
              <h2 className="font-display text-xl font-medium text-black tracking-tight mb-2">{o?.title ?? "Confirmar"}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{o?.message ?? "Tem a certeza que quer continuar?"}</p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => close(false)}
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors px-4 py-2.5"
                >
                  {o?.cancelLabel ?? "Cancelar"}
                </button>
                <button
                  onClick={() => close(true)}
                  autoFocus
                  className={`text-sm font-semibold text-white px-6 py-2.5 transition-colors ${o?.danger ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-red-600"}`}
                >
                  {o?.confirmLabel ?? "Confirmar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmCtx.Provider>
  );
}
