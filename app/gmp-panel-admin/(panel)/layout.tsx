import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Package, Cpu, Tag, Newspaper, Users, ShoppingCart, LifeBuoy, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin GMP Tools" } };

const nav = [
  { href: "/gmp-panel-admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/gmp-panel-admin/categorias", label: "Categorias", Icon: Tag },
  { href: "/gmp-panel-admin/produtos", label: "Produtos", Icon: Package },
  { href: "/gmp-panel-admin/maquinas", label: "Máquinas", Icon: Cpu },
  { href: "/gmp-panel-admin/noticias", label: "Notícias", Icon: Newspaper },
  { href: "/gmp-panel-admin/clientes", label: "Clientes", Icon: Users },
  { href: "/gmp-panel-admin/encomendas", label: "Encomendas", Icon: ShoppingCart },
  { href: "/gmp-panel-admin/suporte", label: "Suporte", Icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <Logo height={30} />
          <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mt-2">Admin</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-all rounded-none">
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-black transition-colors">
            ← Ver site
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-600 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Terminar sessão
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
