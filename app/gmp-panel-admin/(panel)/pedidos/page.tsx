import { db } from "@/lib/db";

export default async function AdminPedidosPage() {
  let quotes: Awaited<ReturnType<typeof db.quoteRequest.findMany>> = [];
  let assistance: Awaited<ReturnType<typeof db.assistanceRequest.findMany>> = [];

  try {
    [quotes, assistance] = await Promise.all([
      db.quoteRequest.findMany({ orderBy: { createdAt: "desc" } }),
      db.assistanceRequest.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
  } catch {}

  function fmt(d: Date) {
    return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-medium text-gray-900">Pedidos</h1>

      {/* Quotes */}
      <div>
        <h2 className="text-base font-medium text-gray-700 mb-4">Pedidos de orçamento ({quotes.length})</h2>
        {quotes.length === 0 ? (
          <div className="bg-white border border-gray-100 p-8 text-center text-sm text-gray-400">Sem pedidos ainda.</div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Data", "Nome", "Email", "Empresa", "Produto", "Mensagem"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(q.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{q.name}</td>
                    <td className="px-4 py-3 text-gray-600">{q.email}</td>
                    <td className="px-4 py-3 text-gray-500">{q.company ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{q.productName ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{q.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assistance */}
      <div>
        <h2 className="text-base font-medium text-gray-700 mb-4">Pedidos de assistência ({assistance.length})</h2>
        {assistance.length === 0 ? (
          <div className="bg-white border border-gray-100 p-8 text-center text-sm text-gray-400">Sem pedidos ainda.</div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Data", "Nome", "Telefone", "Máquina", "Urgência", "Descrição"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assistance.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(a.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.phone}</td>
                    <td className="px-4 py-3 text-gray-500">{a.machineType}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 uppercase tracking-wider ${
                        a.urgency === "CRITICAL" ? "bg-red-100 text-red-700" :
                        a.urgency === "HIGH" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{a.urgency}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{a.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
