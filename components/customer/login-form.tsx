"use client";

import { useActionState } from "react";
import { customerLogin } from "@/app/actions/customer-auth";

export function CustomerLoginForm() {
  const [state, action, pending] = useActionState(customerLogin, null);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
        <input
          name="email"
          type="email"
          required
          autoFocus
          autoComplete="username"
          className="w-full rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Palavra-passe</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-none border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white text-sm font-semibold py-3.5 hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {pending ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}
