"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useConfirm } from "@/components/ui/confirm";

export function DeleteButton({
  action,
  id,
  confirmLabel = "Esta acção é irreversível.",
}: {
  action: (id: string) => Promise<{ success: boolean; error?: string }>;
  id: string;
  confirmLabel?: string;
}) {
  const [pending, start] = React.useTransition();
  const router = useRouter();
  const confirm = useConfirm();

  function onClick() {
    start(async () => {
      const ok = await confirm({ title: "Apagar", message: confirmLabel, confirmLabel: "Apagar", danger: true });
      if (!ok) return;
      const res = await action(id);
      if (!res.success) window.alert(res.error ?? "Erro ao apagar.");
      else router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      title="Apagar"
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
