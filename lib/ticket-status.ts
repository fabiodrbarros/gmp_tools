export interface TicketStatusDef {
  value: string;
  label: string;
  cls: string;
}

export const TICKET_STATUSES: TicketStatusDef[] = [
  { value: "OPEN", label: "Aberto", cls: "bg-amber-50 text-amber-600" },
  { value: "ANSWERED", label: "Respondido", cls: "bg-red-50 text-red-600" },
  { value: "CLOSED", label: "Fechado", cls: "bg-gray-100 text-gray-400" },
];

export function ticketStatus(value: string): TicketStatusDef {
  return TICKET_STATUSES.find((s) => s.value === value) ?? TICKET_STATUSES[0];
}
