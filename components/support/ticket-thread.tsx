import { Paperclip } from "lucide-react";
import { parseImages } from "@/lib/upload";

export interface ThreadMessage {
  id: string;
  author: string; // CUSTOMER | ADMIN
  body: string;
  attachments: string | null;
  createdAt: Date;
}

function fmt(d: Date) {
  return new Date(d).toLocaleString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function fileName(url: string) {
  try { return decodeURIComponent(url.split("/").pop() || url); } catch { return url.split("/").pop() || url; }
}

const IMG = /\.(jpe?g|png|gif|webp|heic)$/i;

export function TicketThread({ messages, viewer }: { messages: ThreadMessage[]; viewer: "CUSTOMER" | "ADMIN" }) {
  return (
    <div className="space-y-4">
      {messages.map((m) => {
        const mine = m.author === viewer;
        const files = parseImages(m.attachments);
        return (
          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
              <div className={`text-[10px] uppercase tracking-wider mb-1 ${mine ? "text-right text-gray-400" : "text-gray-400"}`}>
                {m.author === "ADMIN" ? "GMP" : "Cliente"} · {fmt(m.createdAt)}
              </div>
              <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${mine ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}>
                {m.body}
              </div>
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map((url) =>
                    IMG.test(url) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={url} alt="" className="h-24 w-24 object-cover border border-gray-200" />
                      </a>
                    ) : (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:border-black transition-colors">
                        <Paperclip className="h-3.5 w-3.5" /> {fileName(url)}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
