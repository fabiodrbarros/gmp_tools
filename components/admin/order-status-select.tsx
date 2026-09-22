"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { setOrderStatus } from "@/app/actions/admin-order";
import { ORDER_STATUSES, orderStatus } from "@/lib/order-status";
import { useConfirm } from "@/components/ui/confirm";

export function OrderStatusSelect({ id, value }: { id: string; value: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, start] = React.useTransition();
  const router = useRouter();
  const askConfirm = useConfirm();
  const current = orderStatus(value);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function pick(status: string) {
    setOpen(false);
    if (status === value) return;
    const label = orderStatus(status).label;
    const ok = await askConfirm({
      title: "Alterar estado",
      message: `Marcar esta encomenda como "${label}"?`,
      confirmLabel: "Alterar",
    });
    if (!ok) return;
    start(async () => {
      await setOrderStatus(id, status);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider px-2 py-1 hover:opacity-80 transition-opacity disabled:opacity-50 ${current.cls}`}
      >
        {current.label}
        <ChevronDown className="h-3 w-3" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[190] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <motion.div
              className="relative bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-sm p-7"
              initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="dialog" aria-modal="true"
            >
              <h2 className="font-display text-xl font-medium text-black tracking-tight mb-1">Alterar estado</h2>
              <p className="text-sm text-gray-500 mb-5">Escolha o novo estado da encomenda.</p>
              <div className="space-y-2 mb-5">
                {ORDER_STATUSES.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => pick(o.value)}
                    className={`w-full flex items-center justify-between border px-4 py-3 text-sm transition-colors ${o.value === value ? "border-black" : "border-gray-200 hover:border-black"}`}
                  >
                    <span className="font-medium text-black">{o.label}</span>
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${o.cls}`}>
                      {o.value === value ? "Atual" : "Selecionar"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-500 hover:text-black transition-colors px-4 py-2.5">
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
