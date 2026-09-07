"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  id,
  confirmLabel = "Tem a certeza que quer apagar? Esta acção é irreversível.",
}: {
  action: (id: string) => Promise<{ success: boolean; error?: string }>;
  id: string;
  confirmLabel?: string;
}) {
  const [pending, start] = React.useTransition();
  const router = useRouter();

  function onClick() {
    if (!window.confirm(confirmLabel)) return;
    start(async () => {
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
