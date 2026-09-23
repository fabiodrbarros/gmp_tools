"use client";

import * as React from "react";
import { submitContact } from "@/app/actions/contact";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function ContactForm() {
  const { t } = useLang();
  const SUBJECTS = [
    t("contacts.subj.quote"),
    t("contacts.subj.assist"),
    t("contacts.subj.urgent"),
    t("contacts.subj.info"),
    t("contacts.subj.partner"),
    t("contacts.subj.other"),
  ];
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await submitContact(new FormData(e.currentTarget));
    setPending(false);
    if (res.success) setDone(true);
    else setError(res.error ?? "Erro inesperado.");
  }

  if (done) {
    return (
      <div className="py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-black mb-2">{t("contacts.sentTitle")}</h3>
        <p className="text-gray-500">{t("contacts.sent")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={`${t("contacts.name")} *`}>
          <input required name="name" placeholder={t("contacts.namePh")} className="input" />
        </Field>
        <Field label={`${t("contacts.email")} *`}>
          <input required name="email" type="email" placeholder="email@empresa.pt" className="input" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("contacts.phone")}>
          <input name="phone" type="tel" placeholder="+351 000 000 000" className="input" />
        </Field>
        <div>
          <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">{t("contacts.subject")} *</label>
          <div className="relative">
            <select
              required
              name="subject"
              className="w-full appearance-none rounded-none border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
            >
              <option value="">{t("contacts.subjPlaceholder")}</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <Field label={`${t("contacts.message")} *`}>
        <textarea required name="message" rows={5} placeholder={t("contacts.msgPh")} className="input resize-none" />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white text-sm font-semibold py-4 hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {pending ? t("contacts.sending") : t("contacts.send")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase mb-2">{label}</label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: "w-full appearance-none rounded-none bg-white border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors",
      })}
    </div>
  );
}
