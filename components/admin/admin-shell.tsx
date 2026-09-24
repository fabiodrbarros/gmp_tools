"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Cpu, Tag, Newspaper, Users, ShoppingCart, LifeBuoy, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/layout/logo";

const NAV = [
  { href: "/gmp-panel-admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/gmp-panel-admin/categorias", label: "Categorias", Icon: Tag },
  { href: "/gmp-panel-admin/produtos", label: "Produtos", Icon: Package },
  { href: "/gmp-panel-admin/maquinas", label: "Máquinas", Icon: Cpu },
  { href: "/gmp-panel-admin/noticias", label: "Notícias", Icon: Newspaper },
  { href: "/gmp-panel-admin/clientes", label: "Clientes", Icon: Users },
  { href: "/gmp-panel-admin/encomendas", label: "Encomendas", Icon: ShoppingCart },
  { href: "/gmp-panel-admin/suporte", label: "Suporte", Icon: LifeBuoy },
];

function isActive(pathname: string, href: string) {
  if (href === "/gmp-panel-admin") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 p-3 space-y-0.5">
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all ${
              active ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  return (
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
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // close the drawer whenever the route changes
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-white border-r border-gray-100 flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-gray-100">
          <Logo height={30} />
          <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mt-2">Admin</div>
        </div>
        <NavLinks pathname={pathname} />
        <Footer />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo height={26} />
          <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="p-2 -mr-2 text-gray-600 hover:text-black transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white flex flex-col shadow-xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <Logo height={28} />
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase mt-2">Admin</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <Footer />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}
