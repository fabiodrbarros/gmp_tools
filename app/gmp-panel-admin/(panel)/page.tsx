import { db } from "@/lib/db";

async function getStats() {
  try {
    const [quotes, assistance, contacts] = await Promise.all([
      db.quoteRequest.count({ where: { status: "PENDING" } }),
      db.assistanceRequest.count({ where: { status: "OPEN" } }),
      db.contactMessage.count(),
    ]);
    return { quotes, assistance, contacts };
  } catch {
    return { quotes: 0, assistance: 0, contacts: 0 };
  }
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Orçamentos pendentes", value: stats.quotes, color: "border-yellow-400" },
          { label: "Assistências em aberto", value: stats.assistance, color: "border-red-500" },
          { label: "Mensagens recebidas", value: stats.contacts, color: "border-blue-400" },
        ].map((s) => (
          <div key={s.label} className={`bg-white border-t-2 ${s.color} p-6 shadow-sm`}>
            <div className="text-4xl font-medium text-gray-900 mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-8 text-center text-gray-400 text-sm">
        Seleccione uma secção no menu para gerir conteúdo.
      </div>
    </div>
  );
}
