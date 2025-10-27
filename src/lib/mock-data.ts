import { addDays, subDays } from "date-fns";
import type {
  BlogInsightsSummary,
  BlogPost,
  HealthResponse,
  Order,
  Product,
} from "./types";

const now = new Date();

export const mockHealth: HealthResponse = {
  status: "ok",
  version: "1.0.0",
  uptime: "72h 15m",
  dependencies: {
    database: "connected",
    cache: "degraded",
  },
};

export const mockProducts: Product[] = [
  {
    id: "btc-ledger",
    name: "Boofshop Ledger Cold Wallet",
    description:
      "Secure hardware wallet supporting Bitcoin, Ethereum, and ERC-20 tokens with multi-sig compatibility.",
    price: 189.99,
    currency: "USD",
    status: "active",
    stock: 45,
    tags: ["security", "hardware"],
    createdAt: subDays(now, 15).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
  {
    id: "eth-node",
    name: "Ethereum Validator Node",
    description:
      "Turn-key staking node with automated updates, monitoring, and slashing protection dashboard.",
    price: 2499,
    currency: "USD",
    status: "active",
    stock: 12,
    tags: ["staking", "infrastructure"],
    createdAt: subDays(now, 30).toISOString(),
    updatedAt: subDays(now, 2).toISOString(),
  },
  {
    id: "analytics-suite",
    name: "On-chain Analytics Suite",
    description:
      "Subscription analytics for market movements, whale tracking, and customizable alerts.",
    price: 99,
    currency: "USD",
    status: "draft",
    stock: 999,
    tags: ["subscription", "analytics"],
    createdAt: subDays(now, 45).toISOString(),
    updatedAt: subDays(now, 10).toISOString(),
  },
  {
    id: "defi-bundle",
    name: "DeFi Starter Bundle",
    description:
      "Educational course, simulated trading account, and curated DeFi strategies for beginners.",
    price: 349,
    currency: "USD",
    status: "active",
    stock: 120,
    tags: ["education", "defi"],
    createdAt: subDays(now, 8).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-4012",
    userId: "user-123",
    status: "fulfilled",
    total: 2798.99,
    currency: "USD",
    createdAt: subDays(now, 6).toISOString(),
    updatedAt: subDays(now, 2).toISOString(),
    lineItems: [
      {
        productId: "eth-node",
        name: "Ethereum Validator Node",
        quantity: 1,
        price: 2499,
        currency: "USD",
      },
      {
        productId: "analytics-suite",
        name: "On-chain Analytics Suite",
        quantity: 1,
        price: 99,
        currency: "USD",
      },
      {
        productId: "btc-ledger",
        name: "Boofshop Ledger Cold Wallet",
        quantity: 1,
        price: 189.99,
        currency: "USD",
      },
    ],
  },
  {
    id: "order-4013",
    userId: "user-456",
    status: "processing",
    total: 538.99,
    currency: "USD",
    createdAt: subDays(now, 1).toISOString(),
    lineItems: [
      {
        productId: "defi-bundle",
        name: "DeFi Starter Bundle",
        quantity: 1,
        price: 349,
        currency: "USD",
      },
      {
        productId: "btc-ledger",
        name: "Boofshop Ledger Cold Wallet",
        quantity: 1,
        price: 189.99,
        currency: "USD",
      },
    ],
  },
  {
    id: "order-4014",
    userId: "user-123",
    status: "pending",
    total: 99,
    currency: "USD",
    createdAt: addDays(now, -0.5).toISOString(),
    lineItems: [
      {
        productId: "analytics-suite",
        name: "On-chain Analytics Suite",
        quantity: 1,
        price: 99,
        currency: "USD",
      },
    ],
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "post-btc-insights",
    producerId: "Boofshop",
    title: "Building Trust with Cold Storage",
    slug: "building-trust-with-cold-storage",
    excerpt:
      "How our operators deploy cold wallets and custody policies for institutional clients.",
    contentMarkdown:
      "## Why custody matters\n\nOperators rely on audited cold storage with multi-sig enforcement to protect treasury allocations at scale. We continuously test incident response and rotate access with short-lived credentials.",
    coverImageUrl:
      "https://images.Boofshop.example/assets/cold-storage-vault.jpg",
    tags: ["security", "custody"],
    isDraft: false,
    publishedAt: subDays(now, 4).toISOString(),
    createdAt: subDays(now, 10).toISOString(),
    updatedAt: subDays(now, 4).toISOString(),
  },
  {
    id: "post-launchpad",
    producerId: "Boofshop",
    title: "Introducing the Validator Launchpad",
    slug: "introducing-the-validator-launchpad",
    excerpt:
      "A behind-the-scenes look at our automated validator provisioning pipeline.",
    contentMarkdown:
      "## Launchpad preview\n\nWe orchestrate validator fleets with automated rollbacks. Terraform modules bootstrap hardware, and observability dashboards flag liveness within seconds of deployment.",
    coverImageUrl:
      "https://images.Boofshop.example/assets/validator-launchpad.png",
    tags: ["infrastructure", "product"],
    isDraft: false,
    publishedAt: subDays(now, 12).toISOString(),
    createdAt: subDays(now, 20).toISOString(),
    updatedAt: subDays(now, 12).toISOString(),
  },
  {
    id: "post-roadmap-q4",
    producerId: "Boofshop",
    title: "Q4 Roadmap: Wallet SDK, DeFi Perimeters",
    slug: "q4-roadmap-wallet-sdk-defi",
    excerpt:
      "Sneak peek at upcoming wallet SDK updates, DeFi guardrails, and analytics improvements.",
    contentMarkdown:
      "## Upcoming drops\n\nOur teams are rolling out staged releases across SDKs, introducing pre-trade risk controls and batched signing to minimize gas exposure during peak volatility.",
    coverImageUrl: null,
    tags: ["roadmap", "product"],
    isDraft: true,
    publishedAt: null,
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
];

export const mockBlogInsights: BlogInsightsSummary = {
  totalPosts: mockBlogPosts.length,
  publishedPosts: mockBlogPosts.filter((post) => !post.isDraft).length,
  draftPosts: mockBlogPosts.filter((post) => post.isDraft).length,
  lastPublishedAt:
    mockBlogPosts
      .filter((post) => post.publishedAt)
      .sort(
        (a, b) =>
          new Date(b.publishedAt ?? 0).getTime() -
          new Date(a.publishedAt ?? 0).getTime(),
      )[0]?.publishedAt ?? null,
};
