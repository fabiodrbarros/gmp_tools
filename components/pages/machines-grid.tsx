"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Machine {
  slug: string;
  name: string;
  label: string;
  brand: string;
  condition: string;
  category: string;
  desc: string;
  specs: string[];
}

export interface MachineCategory {
  slug: string;
  label: string;
}

export function MachinesGrid({ categories, machines }: { categories: MachineCategory[]; machines: Machine[] }) {
  const [cat, setCat] = React.useState("todas");
  const cats: MachineCategory[] = [{ slug: "todas", label: "Todas" }, ...categories];
  const filtered = cat === "todas" ? machines : machines.filter((m) => m.category === cat);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {cats.map((c) => {
          const active = cat === c.slug;
          const n = c.slug === "todas" ? machines.length : machines.filter((m) => m.category === c.slug).length;
          return (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                active ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.label}
              <span className={active ? "text-white/50" : "text-gray-400"}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <Link key={m.slug} href={`/maquinas/${m.slug}`} className="bg-white border border-gray-100 group hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Image placeholder */}
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-medium tracking-widest text-gray-300 uppercase">{m.brand}</div>
                <div className="text-2xl font-medium text-gray-200 mt-1">{m.name.split(" ").slice(-1)}</div>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[10px] font-medium tracking-widest text-red-500 uppercase bg-red-50 px-2 py-1">{m.label}</span>
                <span className={`text-[10px] font-medium tracking-widest uppercase px-2 py-1 ${m.condition === "Nova" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {m.condition}
                </span>
              </div>
              <h3 className="text-xl font-medium text-black mb-3 group-hover:text-red-600 transition-colors">{m.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{m.desc}</p>
              <ul className="space-y-2 mb-8">
                {m.specs.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-xs text-gray-500">
                    <span className="h-px w-3 bg-red-600 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-black group-hover:text-red-600 transition-colors pt-6 border-t border-gray-50">
                Saber mais <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        {/* CTA card */}
        <div className="bg-red-600 p-9 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="text-[10px] font-medium tracking-widest text-white/70 uppercase mb-4">Thibaut · Portugal</div>
            <h3 className="text-xl font-medium text-white mb-3">Não encontrou a máquina certa?</h3>
            <p className="text-sm text-white/80 leading-relaxed">Temos acesso a toda a gama Thibaut. Consulte-nos.</p>
          </div>
          <Link href="/contactos" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/30 px-5 py-3 hover:bg-black hover:border-black transition-all w-fit">
            Falar com um especialista <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
