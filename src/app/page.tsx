import { cookies } from "next/headers";
import Link from "next/link";
import {
  getCurrentUser,
  getHealth,
  getOrders,
  getProducts,
  isForbiddenError,
  isNotFoundError,
  isUnauthorizedError,
} from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function Home() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;

  const health = await getHealth(init);

  let currentUser: Awaited<ReturnType<typeof getCurrentUser>> | null = null;
  try {
    currentUser = await getCurrentUser(init);
  } catch (error) {
    if (
      !isUnauthorizedError(error) &&
      !isForbiddenError(error) &&
      !isNotFoundError(error)
    ) {
      throw error;
    }
  }

  const isAdmin = currentUser?.role === "admin";

  let products = [] as Awaited<ReturnType<typeof getProducts>>;
  let orders = [] as Awaited<ReturnType<typeof getOrders>>;

  if (isAdmin) {
    products = await getProducts(init);
    orders = await getOrders(init);
  }

  const activeProducts = products.filter(
    (product) => product.status !== "archived",
  );
  const recentOrders = orders.slice(0, 3);
  const totalMrr = orders
    .filter((order) => order.status === "fulfilled")
    .reduce((total, order) => total + order.total, 0);

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-teal-500/5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 lg:max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
              Roadmap Control Tower
            </span>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Coordinate the Cryptotrade frontend suite with live backend
              telemetry
            </h1>
            <p className="text-base text-slate-300">
              Monitor health, curate the catalog, and ensure delivery readiness
              for React web and Flutter mobile clients. Tailwind tokens, shared
              data contracts, and resilient fallbacks are baked in so teams can
              ship confidently.
            </p>
            {isAdmin ? (
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <Link
                  href="/products"
                  className="rounded-full bg-teal-400/20 px-4 py-2 font-medium text-teal-100 shadow hover:bg-teal-400/30"
                >
                  Manage catalog
                </Link>
                <Link
                  href="/orders"
                  className="rounded-full border border-white/10 px-4 py-2 font-medium text-white/80 hover:border-teal-400/40 hover:text-white"
                >
                  Review orders
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Product and order operations are available to admin accounts. If
                you need access, contact an administrator.
              </p>
            )}
          </div>
          <dl className="grid w-full max-w-sm grid-cols-2 gap-4 text-sm text-slate-300">
            {isAdmin ? (
              <>
                <MetricCard
                  label="Products"
                  value={activeProducts.length.toString()}
                  trend="Live in catalog"
                />
                <MetricCard
                  label="MRR (fulfilled)"
                  value={formatCurrency(totalMrr, "USD")}
                  trend="Rolling 30 days"
                />
                <MetricCard
                  label="Orders"
                  value={orders.length.toString()}
                  trend={`${orders.filter((order) => order.status === "processing").length} processing`}
                />
              </>
            ) : null}
            <MetricCard
              label="API Health"
              value={health.status.toUpperCase()}
              trend={health.uptime ?? "—"}
            />
          </dl>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Platform scope
              </h2>
              <p className="text-sm text-slate-400">
                Alignment of React web and Flutter mobile deliverables
              </p>
            </div>
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violet-200">
              Dual Stack
            </span>
          </header>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <CapabilityCard
              title="Web"
              description="React 18+ with Vite, Tailwind CSS, TanStack Query, and axios client ready for auth interceptors."
              items={[
                "Routing via React Router blueprint (mirrored with Next.js app routes)",
                "Shared Tailwind token contract",
                "Optimistic cart interactions persisted in localStorage",
              ]}
            />
            <CapabilityCard
              title="Mobile"
              description="Flutter 3+ with Riverpod state, Dio HTTP client, and Tailwind-inspired design tokens."
              items={[
                "Flavor-based environment management",
                "Shared preferences persistence for cart",
                "Utility widgets to emulate Tailwind spacing & typography",
              ]}
            />
          </div>
        </article>
        <aside className="space-y-6">
          <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              Backend telemetry
            </h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <dt>Base URL</dt>
                <dd className="font-medium text-slate-100">
                  http://localhost:8080
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Version</dt>
                <dd>{health.version ?? "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt>Dependencies</dt>
                <dd className="text-right">
                  {health.dependencies ? (
                    <ul className="space-y-1 text-right">
                      {Object.entries(health.dependencies).map(
                        ([name, status]) => (
                          <li key={name} className="font-medium text-slate-200">
                            <span className="text-slate-400">{name}</span>:{" "}
                            {status}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              Delivery checklist
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {[
                "Vite + Next.js parity starter with Tailwind tokens",
                "OpenAPI-driven typings for TypeScript & Dart",
                "CI enforcing lint, tests, and formatters",
                "Docs to flip between API mocks and live backend",
                "Storybook & widget book seeds for shared components",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className="mt-1 h-2 w-2 rounded-full bg-teal-400"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      {isAdmin ? (
        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Recent orders
              </h2>
              <p className="text-sm text-slate-400">
                Audit history and fulfilment status synced with backend
                contracts
              </p>
            </div>
            <Link
              href="/orders"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:border-teal-400/40 hover:text-white"
            >
              View all orders
            </Link>
          </header>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">
                          {order.id}
                        </div>
                        <div className="text-xs text-slate-400">
                          {order.lineItems.length} items
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(order.total, order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-white/5">
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-2 text-lg font-semibold text-white">{value}</dd>
      <p className="text-xs text-slate-400">{trend}</p>
    </div>
  );
}

function CapabilityCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-300">{description}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-400"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-200 border-amber-500/40",
    processing: "bg-sky-500/20 text-sky-200 border-sky-500/40",
    fulfilled: "bg-teal-500/20 text-teal-100 border-teal-400/40",
    cancelled: "bg-rose-500/20 text-rose-200 border-rose-500/40",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] ?? ""}`}
    >
      {status}
    </span>
  );
}
