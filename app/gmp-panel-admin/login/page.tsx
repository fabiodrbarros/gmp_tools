import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: "Entrar | Admin GMP Tools" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo height={48} />
          <div className="text-[10px] text-gray-400 font-semibold tracking-[0.2em] uppercase mt-4">Painel de administração</div>
        </div>
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <LoginForm />
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-6">Acesso restrito · GMP Tools</p>
      </div>
    </div>
  );
}
