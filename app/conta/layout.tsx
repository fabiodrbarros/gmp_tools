import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getCustomer } from "@/lib/customer-auth";
import { customerLogout } from "@/app/actions/customer-auth";
import { ContaNav } from "@/components/customer/conta-nav";
import { getT } from "@/lib/i18n-server";

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomer();
  if (!session) redirect("/entrar");
  if (session.mustChangePassword) redirect("/definir-password");
  const { t } = await getT();

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6 lg:py-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h1 className="font-display text-2xl lg:text-4xl font-medium text-black tracking-tight">{t("acct.myAccount")}</h1>
            <p className="text-gray-500 mt-1 text-sm truncate">{session.name}{session.company ? ` · ${session.company}` : ""}</p>
          </div>
          <form action={customerLogout} className="shrink-0">
            <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" /> {t("acct.logout")}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-6 lg:py-10 grid lg:grid-cols-[220px_1fr] gap-6 lg:gap-12">
        <aside className="lg:border-r border-gray-100 lg:pr-4">
          <ContaNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
