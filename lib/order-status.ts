export interface OrderStatusDef {
  value: string;
  label: string;
  cls: string; // badge classes
}

export const ORDER_STATUSES: OrderStatusDef[] = [
  { value: "PENDING", label: "Pendente", cls: "bg-amber-50 text-amber-600" },
  { value: "CONFIRMED", label: "Confirmada", cls: "bg-blue-50 text-blue-600" },
  { value: "PROCESSING", label: "Em processamento", cls: "bg-indigo-50 text-indigo-600" },
  { value: "SHIPPED", label: "Enviada", cls: "bg-green-50 text-green-600" },
  { value: "CANCELLED", label: "Cancelada", cls: "bg-gray-100 text-gray-400" },
];

export const ORDER_STATUS_VALUES = ORDER_STATUSES.map((s) => s.value);

export function orderStatus(value: string): OrderStatusDef {
  return ORDER_STATUSES.find((s) => s.value === value) ?? ORDER_STATUSES[0];
}
