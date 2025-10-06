import { z } from "zod";
import { getApiBaseUrl, getMockMode } from "./env";
import {
  mockBlogInsights,
  mockBlogPosts,
  mockHealth,
  mockOrders,
  mockProducts,
} from "./mock-data";
import type {
  ActivateUserInput,
  Address,
  AddressInput,
  CreateAddressInput,
  CreateOrderInput,
  CreateUserInput,
  BlogInsightsSummary,
  BlogPost,
  BlogPostInput,
  HealthResponse,
  LoginStartInput,
  LoginVerifyInput,
  Order,
  PasswordForgotInput,
  PasswordResetInput,
  Product,
  UpdateAddressInput,
  User,
} from "./types";

const apiUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const addressApiSchema = z.object({
  id: z.string(),
  label: z.string(),
  recipient_name: z.string(),
  line1: z.string(),
  line2: z.string().nullish(),
  city: z.string(),
  region: z.string(),
  postal_code: z.string(),
  country: z.string(),
  phone: z.string(),
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const userSchema = apiUserSchema.transform((user) => {
  const normalized: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };

  return normalized;
});

const addressSchema = addressApiSchema.transform(
  (address) =>
    ({
      id: address.id,
      label: address.label,
      recipientName: address.recipient_name,
      line1: address.line1,
      line2: address.line2 ?? undefined,
      city: address.city,
      region: address.region,
      postalCode: address.postal_code,
      country: address.country,
      phone: address.phone,
      isDefault: address.is_default,
      createdAt: address.created_at,
      updatedAt: address.updated_at,
    }) satisfies Address,
);

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  price: z.number(),
  currency: z.string().default("USD"),
  status: z.enum(["draft", "active", "archived"]).optional(),
  stock: z.number().optional(),
  tags: z.array(z.string()).optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["pending", "processing", "fulfilled", "cancelled"]),
  total: z.number(),
  currency: z.string().default("USD"),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        quantity: z.number(),
        price: z.number(),
        currency: z.string().default("USD"),
      }),
    )
    .default([]),
});

const blogPostApiSchema = z.object({
  id: z.string(),
  producer_id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content_markdown: z.string(),
  cover_image_url: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_draft: z.boolean(),
  published_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const blogPostSchema = blogPostApiSchema.transform(
  (post) =>
    ({
      id: post.id,
      producerId: post.producer_id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentMarkdown: post.content_markdown,
      coverImageUrl: post.cover_image_url ?? null,
      tags: post.tags ?? [],
      isDraft: post.is_draft,
      publishedAt: post.published_at ?? null,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }) satisfies BlogPost,
);

const blogInsightsSchema = z
  .object({
    total_posts: z.number(),
    published_posts: z.number(),
    draft_posts: z.number(),
    last_published_at: z.string().nullable().optional(),
  })
  .transform(
    (value) =>
      ({
        totalPosts: value.total_posts,
        publishedPosts: value.published_posts,
        draftPosts: value.draft_posts,
        lastPublishedAt: value.last_published_at ?? null,
      }) satisfies BlogInsightsSummary,
  );

const healthSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
  uptime: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
});

type ApiClientError = Error & {
  status?: number;
  body?: unknown;
};

function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof Error && "status" in error;
}

export function isUnauthorizedError(error: unknown): error is ApiClientError {
  return isApiClientError(error) && error.status === 401;
}

export function isForbiddenError(error: unknown): error is ApiClientError {
  return isApiClientError(error) && error.status === 403;
}

export function isNotFoundError(error: unknown): error is ApiClientError {
  return isApiClientError(error) && error.status === 404;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const {
    headers: initHeaders,
    next: initNext,
    method,
    credentials: initCredentials,
    ...rest
  } = init ?? {};
  const normalizedMethod = (method ?? "GET").toUpperCase();
  const cacheDirective = (rest as { cache?: RequestCache }).cache;
  const shouldApplyRevalidate =
    normalizedMethod === "GET" && cacheDirective !== "no-store";

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    method: normalizedMethod,
    credentials: initCredentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...initHeaders,
    },
    next: shouldApplyRevalidate ? { revalidate: 30, ...initNext } : initNext,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let errorBody: unknown;

    try {
      errorBody = await response.clone().json();
      if (
        errorBody &&
        typeof errorBody === "object" &&
        "error" in errorBody &&
        typeof (errorBody as { error: unknown }).error === "string"
      ) {
        message = (errorBody as { error: string }).error;
      }
    } catch (_jsonError) {
      try {
        const fallbackText = await response.text();
        if (fallbackText) {
          message = fallbackText;
        }
      } catch (textError) {
        console.error("Failed to read error response", textError);
      }
    }

    const error = new Error(message) as ApiClientError;
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

interface SafeRequestOptions {
  allowAuthFallback?: boolean;
}

async function safeRequest<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  options?: SafeRequestOptions,
): Promise<T> {
  if (getMockMode()) {
    return fallback;
  }

  try {
    return await fetcher();
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      if (options?.allowAuthFallback) {
        return fallback;
      }
      throw error;
    }
    console.warn("Falling back to mock data due to API error", error);
    return fallback;
  }
}

export async function getHealth(init?: RequestInit): Promise<HealthResponse> {
  return safeRequest(
    async () => healthSchema.parse(await request("/health", init)),
    mockHealth,
    { allowAuthFallback: true },
  );
}

export async function getProducts(init?: RequestInit): Promise<Product[]> {
  return safeRequest(async () => {
    const data = await request<unknown>("/api/v1/products", init);
    const parsed = z.array(productSchema).parse(data);
    return parsed;
  }, mockProducts, { allowAuthFallback: true });
}

export async function getProduct(
  productId: string,
  init?: RequestInit,
): Promise<Product | undefined> {
  return safeRequest(
    async () => {
      const data = await request<unknown>(
        `/api/v1/products/${productId}`,
        init,
      );
      return productSchema.parse(data);
    },
    mockProducts.find((product) => product.id === productId),
    { allowAuthFallback: true },
  );
}

export async function getOrders(init?: RequestInit): Promise<Order[]> {
  return safeRequest(async () => {
    const data = await request<unknown>("/api/v1/orders", init);
    return z.array(orderSchema).parse(data);
  }, mockOrders);
}

export async function getProducerBlogPosts(
  producerId: string,
  init?: RequestInit,
): Promise<BlogPost[]> {
  return safeRequest(async () => {
    const data = await request<unknown>(
      `/api/v1/producers/${producerId}/blog-posts`,
      {
        method: "GET",
        cache: "no-store",
        ...init,
      },
    );
    return z.array(blogPostSchema).parse(data);
  }, mockBlogPosts.filter((post) => post.producerId === producerId));
}

export async function getProducerBlogPost(
  producerId: string,
  postId: string,
  init?: RequestInit,
): Promise<BlogPost | undefined> {
  return safeRequest(async () => {
    const data = await request<unknown>(
      `/api/v1/producers/${producerId}/blog-posts/${postId}`,
      {
        method: "GET",
        cache: "no-store",
        ...init,
      },
    );
    return blogPostSchema.parse(data);
  }, mockBlogPosts.find((post) => post.producerId === producerId && post.id === postId));
}

export async function getProducerBlogInsights(
  producerId: string,
  init?: RequestInit,
): Promise<BlogInsightsSummary> {
  return safeRequest(async () => {
    const data = await request<unknown>(
      `/api/v1/producers/${producerId}/blog/insights`,
      {
        method: "GET",
        cache: "no-store",
        ...init,
      },
    );
    return blogInsightsSchema.parse(data);
  }, buildMockBlogInsights(producerId));
}

export async function getStorefrontBlogPosts(
  producerId: string,
  init?: RequestInit,
): Promise<BlogPost[]> {
  return safeRequest(async () => {
    const data = await request<unknown>(
      `/api/v1/storefronts/${producerId}/blog-posts`,
      {
        method: "GET",
        next: { revalidate: 300 },
        ...init,
      },
    );
    return z.array(blogPostSchema).parse(data);
  },
  mockBlogPosts.filter((post) => !post.isDraft && post.producerId === producerId),
  { allowAuthFallback: true });
}

export async function getStorefrontBlogPost(
  producerId: string,
  slug: string,
  init?: RequestInit,
): Promise<BlogPost | undefined> {
  return safeRequest(async () => {
    const data = await request<unknown>(
      `/api/v1/storefronts/${producerId}/blog-posts/${slug}`,
      {
        method: "GET",
        next: { revalidate: 300 },
        ...init,
      },
    );
    return blogPostSchema.parse(data);
  },
  mockBlogPosts.find(
    (post) => !post.isDraft && post.producerId === producerId && post.slug === slug,
  ),
  { allowAuthFallback: true });
}

function buildMockUser(): User {
  const now = new Date().toISOString();
  return {
    id: "mock-auth-user",
    name: "Mock Operator",
    email: "operator@example.com",
    mobile: "+15555550123",
    role: "admin",
    createdAt: now,
    updatedAt: now,
  };
}

function buildMockBlogInsights(producerId: string): BlogInsightsSummary {
  if (producerId === "Boofshop") {
    return mockBlogInsights;
  }

  const posts = mockBlogPosts.filter((post) => post.producerId === producerId);
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      lastPublishedAt: null,
    };
  }

  const published = posts.filter((post) => !post.isDraft);
  const lastPublishedAt = published
    .map((post) => post.publishedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;

  return {
    totalPosts: posts.length,
    publishedPosts: published.length,
    draftPosts: posts.length - published.length,
    lastPublishedAt,
  };
}

function serializeBlogPostInput(input: BlogPostInput) {
  const payload: Record<string, unknown> = {
    title: input.title,
    excerpt: input.excerpt,
    content_markdown: input.contentMarkdown,
    tags: input.tags,
  };

  if (input.slug) {
    payload.slug = input.slug;
  }
  if (input.coverImageUrl !== undefined) {
    payload.cover_image_url = input.coverImageUrl;
  }
  if (typeof input.publish !== "undefined") {
    payload.publish = input.publish;
  }

  return payload;
}

function buildMockBlogPost(
  producerId: string,
  input: BlogPostInput,
  overrides?: Partial<BlogPost>,
): BlogPost {
  const now = new Date().toISOString();
  const baseSlug = input.slug
    ? input.slug
    : input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
  const publishedAt = input.publish ? now : null;
  return {
    id: overrides?.id ?? `mock-blog-${Date.now()}`,
    producerId,
    title: input.title,
    slug: baseSlug,
    excerpt: input.excerpt,
    contentMarkdown: input.contentMarkdown,
    coverImageUrl: input.coverImageUrl ?? null,
    tags: input.tags,
    isDraft: !input.publish,
    publishedAt,
    createdAt: overrides?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function createProducerBlogPost(
  producerId: string,
  input: BlogPostInput,
): Promise<BlogPost> {
  if (getMockMode()) {
    return buildMockBlogPost(producerId, input);
  }

  const data = await request<unknown>(
    `/api/v1/producers/${producerId}/blog-posts`,
    {
      method: "POST",
      body: JSON.stringify(serializeBlogPostInput(input)),
      cache: "no-store",
    },
  );
  return blogPostSchema.parse(data);
}

export async function updateProducerBlogPost(
  producerId: string,
  postId: string,
  input: BlogPostInput,
): Promise<BlogPost> {
  if (getMockMode()) {
    const existing = mockBlogPosts.find(
      (post) => post.producerId === producerId && post.id === postId,
    );
    return buildMockBlogPost(producerId, input, {
      id: postId,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
  }

  const data = await request<unknown>(
    `/api/v1/producers/${producerId}/blog-posts/${postId}`,
    {
      method: "PUT",
      body: JSON.stringify(serializeBlogPostInput(input)),
      cache: "no-store",
    },
  );
  return blogPostSchema.parse(data);
}

export async function deleteProducerBlogPost(
  producerId: string,
  postId: string,
): Promise<void> {
  if (getMockMode()) {
    return;
  }

  await request<void>(`/api/v1/producers/${producerId}/blog-posts/${postId}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

function serializeAddressInput(input: AddressInput) {
  return {
    label: input.label,
    recipient_name: input.recipientName,
    line1: input.line1,
    line2: input.line2 ?? null,
    city: input.city,
    region: input.region,
    postal_code: input.postalCode,
    country: input.country,
    phone: input.phone,
    is_default: input.isDefault ?? false,
  };
}

export async function getAddresses(init?: RequestInit): Promise<Address[]> {
  try {
    const data = await request<unknown>("/api/v1/addresses", {
      method: "GET",
      cache: "no-store",
      ...init,
    });
    return z.array(addressSchema).parse(data);
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }
    throw error;
  }
}

export async function createAddress(
  input: CreateAddressInput,
): Promise<Address> {
  const data = await request<unknown>("/api/v1/addresses", {
    method: "POST",
    body: JSON.stringify(serializeAddressInput(input)),
    cache: "no-store",
  });
  return addressSchema.parse(data);
}

export async function updateAddress(
  input: UpdateAddressInput,
): Promise<Address> {
  const { id, ...rest } = input;
  const data = await request<unknown>(`/api/v1/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(serializeAddressInput(rest)),
    cache: "no-store",
  });
  return addressSchema.parse(data);
}

export async function deleteAddress(addressId: string): Promise<void> {
  await request<void>(`/api/v1/addresses/${addressId}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

export async function setDefaultAddress(addressId: string): Promise<Address> {
  const data = await request<unknown>(
    `/api/v1/addresses/${addressId}/default`,
    {
      method: "POST",
      cache: "no-store",
    },
  );
  return addressSchema.parse(data);
}

export async function createUser(input: CreateUserInput): Promise<User> {
  if (getMockMode()) {
    return {
      id: `mock-user-${Date.now()}`,
      name: input.name,
      email: input.email,
      mobile: input.mobile,
      role: "operator",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const data = await request<unknown>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(input),
    cache: "no-store",
  });

  return userSchema.parse(data);
}

export async function getCurrentUser(init?: RequestInit): Promise<User> {
  if (getMockMode()) {
    return buildMockUser();
  }

  const data = await request<unknown>("/api/v1/auth/me", {
    method: "GET",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : (init?.headers as Record<string, string> | undefined)),
    },
  });

  return userSchema.parse(data);
}

export async function activateUser(input: ActivateUserInput): Promise<void> {
  if (getMockMode()) {
    return;
  }

  await request<void>("/api/v1/auth/activate", {
    method: "POST",
    body: JSON.stringify(input),
    cache: "no-store",
  });
}

export async function startLogin(input: LoginStartInput): Promise<void> {
  if (getMockMode()) {
    return;
  }

  await request<void>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    cache: "no-store",
  });
}

export async function verifyLogin(input: LoginVerifyInput): Promise<User> {
  if (getMockMode()) {
    return buildMockUser();
  }

  await request<void>("/api/v1/auth/login/verify", {
    method: "POST",
    body: JSON.stringify(input),
    cache: "no-store",
  });

  return getCurrentUser();
}

export async function requestPasswordReset(
  input: PasswordForgotInput,
): Promise<void> {
  await request<void>("/api/v1/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify(input),
    cache: "no-store",
  });
}

export async function resetPassword(input: PasswordResetInput): Promise<void> {
  await request<void>("/api/v1/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(input),
    cache: "no-store",
  });
}

export async function logout(): Promise<void> {
  if (getMockMode()) {
    return;
  }

  try {
    await request<void>("/api/v1/auth/logout", {
      method: "POST",
      cache: "no-store",
    });
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      return;
    }
    throw error;
  }
}

export async function createOrder(input: CreateOrderInput): Promise<void> {
  const payload: Record<string, unknown> = {
    user_id: input.userId,
    currency: input.currency,
    items: input.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  };

  if (input.addressId) {
    payload.address_id = input.addressId;
  } else if (input.shippingAddress) {
    payload.shipping_address = serializeAddressInput(input.shippingAddress);
  }

  await request<void>("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}
