export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type ProductWithRelations = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | null;
  comparePrice?: number | null;
  taxRate: number;
  stock: number;
  stockStatus: string;
  purchaseMode: string;
  isFeatured: boolean;
  isActive: boolean;
  applications: string[];
  compatibleMaterials: string[];
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string; logo?: string | null } | null;
  images: { id: string; url: string; alt?: string | null; order: number }[];
  variants: { id: string; name: string; value: string; price?: number | null; stock: number }[];
  specifications: { id: string; key: string; value: string; order: number }[];
  documents: { id: string; name: string; url: string; type: string }[];
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  purchaseMode: string;
};

export type CartState = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
};

export type OrderStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type QuoteStatusType =
  | "NEW"
  | "ANALYZING"
  | "RESPONDED"
  | "ACCEPTED"
  | "REJECTED";

export type AssistanceStatusType =
  | "NEW"
  | "ANALYZING"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PREPARING: "Em Preparação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatusType, string> = {
  NEW: "Novo",
  ANALYZING: "Em Análise",
  RESPONDED: "Respondido",
  ACCEPTED: "Aceite",
  REJECTED: "Recusado",
};

export const ASSISTANCE_STATUS_LABELS: Record<AssistanceStatusType, string> = {
  NEW: "Novo",
  ANALYZING: "Em Análise",
  SCHEDULED: "Agendado",
  IN_PROGRESS: "Em Curso",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};
