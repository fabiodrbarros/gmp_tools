"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, User, KeyRound, LifeBuoy } from "lucide-react";

const LINKS = [
  { href: "/conta/encomendas", label: "Encomendas", Icon: Package },
  { href: "/conta/suporte", label: "Suporte", Icon: LifeBuoy },
  { href: "/conta/dados", label: "Os meus dados", Icon: User },
  { href: "/conta/palavra-passe", label: "Palavra-passe", Icon: KeyRound },
];

export function ContaNav() {
  const pathname = usePathname();
  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2.5 px-3.5 py-2.5 text-sm whitespace-nowrap transition-colors ${
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
