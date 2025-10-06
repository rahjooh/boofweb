export interface HealthResponse {
  status: string;
  version?: string;
  uptime?: string;
  dependencies?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  status?: "draft" | "active" | "archived";
  stock?: number;
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "processing" | "fulfilled" | "cancelled";
  total: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  lineItems: OrderLineItem[];
  addressId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: "admin" | "operator" | string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  line1: string;
  line2?: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface AddressInput {
  label: string;
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface CreateAddressInput extends AddressInput {}

export interface UpdateAddressInput extends AddressInput {
  id: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  currency: string;
  items: CreateOrderItemInput[];
  addressId?: string;
  shippingAddress?: AddressInput;
}

export interface LoginStartInput {
  mobile: string;
  password: string;
}

export interface LoginVerifyInput {
  mobile: string;
  code: string;
}

export interface ActivateUserInput {
  mobile: string;
  code: string;
}

export interface PasswordForgotInput {
  email: string;
  mobile: string;
}

export interface PasswordResetInput {
  email: string;
  mobile: string;
  code: string;
  password: string;
}

export interface ApiErrorShape {
  error: string;
  code?: string | number;
  details?: unknown;
}

export interface BlogPost {
  id: string;
  producerId: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string | null;
  tags: string[];
  isDraft: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string | null;
  tags: string[];
  publish?: boolean;
}

export interface BlogInsightsSummary {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  lastPublishedAt?: string | null;
}
