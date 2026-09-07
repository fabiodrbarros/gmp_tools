import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-medium text-gray-100 leading-none mb-6 select-none">404</div>
        <h1 className="text-3xl font-medium text-black mb-3">Página não encontrada.</h1>
        <p className="text-gray-500 mb-8">A página que procura não existe ou foi movida.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 hover:bg-red-600 transition-colors group">
          Voltar ao início <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
