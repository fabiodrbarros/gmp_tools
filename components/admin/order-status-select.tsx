"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setOrderStatus } from "@/app/actions/admin-order";
import { useConfirm } from "@/components/ui/confirm";

const OPTIONS = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "CANCELLED", label: "Cancelada" },
];

export function OrderStatusSelect({ id, value }: { id: string; value: string }) {
  const [pending, start] = React.useTransition();
  const router = useRouter();
  const confirm = useConfirm();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value;
        const label = OPTIONS.find((o) => o.value === status)?.label ?? status;
        start(async () => {
          const ok = await confirm({ title: "Alterar estado", message: `Marcar a encomenda como "${label}"?`, confirmLabel: "Alterar" });
          if (!ok) { router.refresh(); return; }
          await setOrderStatus(id, status);
          router.refresh();
        });
      }}
      className="rounded-none border border-gray-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-black transition-colors disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
