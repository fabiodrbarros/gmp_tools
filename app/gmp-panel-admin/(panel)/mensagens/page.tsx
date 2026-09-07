import { db } from "@/lib/db";

export default async function AdminMensagensPage() {
  let messages: Awaited<ReturnType<typeof db.contactMessage.findMany>> = [];
  try {
    messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch {}

  function fmt(d: Date) {
    return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900 mb-6">Mensagens de contacto ({messages.length})</h1>
      {messages.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center text-sm text-gray-400">Sem mensagens ainda.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-white border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="font-medium text-gray-900">{m.name}</span>
                  <span className="text-gray-400 text-sm ml-2">· {m.email}</span>
                  {m.phone && <span className="text-gray-400 text-sm ml-2">· {m.phone}</span>}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{fmt(m.createdAt)}</span>
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">{m.subject}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{m.message}</p>
              <a href={`mailto:${m.email}?subject=Re: ${m.subject}`} className="inline-block mt-3 text-xs font-semibold text-red-600 hover:text-red-700">
                Responder →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
