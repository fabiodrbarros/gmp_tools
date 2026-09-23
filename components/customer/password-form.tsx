"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { changePassword } from "@/app/actions/customer-password";
import { useConfirm } from "@/components/ui/confirm";
import { useLang } from "@/lib/i18n";

export function PasswordForm({ redirectTo }: { redirectTo?: string }) {
  const { t } = useLang();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const confirm = useConfirm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!(await confirm({ title: t("pw.title"), message: t("pw.confirmMsg"), confirmLabel: t("pw.title") }))) return;
    setPending(true);
    setError("");
    setDone(false);
    const res = await changePassword(fd);
    setPending(false);
    if (res.success) {
      setDone(true);
      formRef.current?.reset();
      if (redirectTo) setTimeout(() => router.push(redirectTo), 700);
    } else {
      setError(res.error);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          <CheckCircle2 className="h-4 w-4" /> {t("pw.changed")}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      <Field label={t("pw.current")}><input required name="current" type="password" autoComplete="current-password" /></Field>
      <Field label={t("pw.new")}><input required name="next" type="password" autoComplete="new-password" placeholder={t("pw.newPh")} /></Field>
      <Field label={t("pw.confirm")}><input required name="confirm" type="password" autoComplete="new-password" /></Field>

      <button type="submit" disabled={pending} className="bg-black text-white text-sm font-semibold px-7 py-3 hover:bg-red-600 transition-colors disabled:opacity-50">
        {pending ? t("pw.saving") : t("pw.title")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: "w-full appearance-none rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors",
      })}
    </div>
  );
}
