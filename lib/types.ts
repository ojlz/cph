export interface ProductVariant {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  variants?: ProductVariant[];
  image?: string;
  categoryId: string;
  group?: string;
  ingredients?: string[];
  available: boolean;
  featured: boolean;
  promotionId?: string;
  oldPrice?: number;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  icon?: string;
  description?: string;
  highlight?: string;
  image?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: "direct" | "coupon";
  productId?: string;
  oldPrice?: number;
  newPrice?: number;
  couponCode?: string;
  discountPercent?: number;
  active: boolean;
  validUntil?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  order: number;
}

export interface OpeningHours {
  days: DaySchedule[];
  notes?: string;
}

export interface DaySchedule {
  day: string;
  open: string;
  close: string;
  open2?: string;
  close2?: string;
  isOpen: boolean;
}

export interface OrderItem {
  productName: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  date: string;
  nome: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  couponCode?: string;
  total: number;
  mode: "retirada" | "entrega";
  endereco?: { bairro: string; rua: string; numero: string; referencia?: string };
  pagamento: string;
  observacoes?: string;
  status: "pendente" | "confirmado" | "cancelado";
  ip?: string;
  deliveryFee?: number;
}

export interface ContactMessage {
  id: string;
  date: string;
  name: string;
  email?: string;
  subject: string;
  rating?: number;
  message: string;
}

export interface BusinessSettings {
  name: string;
  description: string;
  shortDescription: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
  foundedYear: number;
  rating: number;
  hasDelivery?: boolean;
  hasBalcao?: boolean;
  acceptsCoupons?: boolean;
}
