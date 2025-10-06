import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getCurrentUser,
  getOrders,
  getProduct,
  isForbiddenError,
  isNotFoundError,
  isUnauthorizedError,
} from "@/lib/api-client";
import { getApiBaseUrl } from "@/lib/env";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;

  let product: Awaited<ReturnType<typeof getProduct>>;
  try {
    const currentUser = await getCurrentUser(init);
    if (currentUser.role !== "admin") {
      redirect("/login");
    }

    product = await getProduct(id, init);
  } catch (error) {
    if (
      isUnauthorizedError(error) ||
      isForbiddenError(error) ||
      isNotFoundError(error)
    ) {
      redirect("/login");
    }
    throw error;
  }

  if (!product) {
    notFound();
  }

  let orders: Awaited<ReturnType<typeof getOrders>>;
  try {
    orders = await getOrders(init);
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      redirect("/login");
    }
    throw error;
  }
  const relatedOrders = orders.filter((order) =>
    order.lineItems.some((item) => item.productId === product.id),
  );

  return (
    <div className="space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-200 hover:text-teal-100"
      >
        ← Back to products
      </Link>
      <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-white">
              {product.name}
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              {product.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right text-sm text-slate-300">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Product ID
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-200">
              {product.id}
            </span>
            <StatusBadge status={product.status ?? "draft"} />
          </div>
        </header>

        <dl className="grid gap-6 text-sm text-slate-300 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Price
            </dt>
            <dd className="mt-2 text-lg font-semibold text-white">
              {formatCurrency(product.price, product.currency)}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Inventory
            </dt>
            <dd className="mt-2 text-lg font-semibold text-white">
              {product.stock ?? "—"}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Created
            </dt>
            <dd className="mt-2 text-lg font-semibold text-white">
              {formatDate(product.createdAt)}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Updated
            </dt>
            <dd className="mt-2 text-lg font-semibold text-white">
              {formatDate(product.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">
            Implementation checklist
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>
              ✓ Ensure Tailwind token usage across React web & Flutter widget
              equivalents
            </li>
            <li>✓ Connect axios/Dio clients to {getApiBaseUrl()}</li>
            <li>
              ✓ Mirror optimistic cart handling via TanStack Query & Riverpod
            </li>
            <li>✓ Document QA cases in Storybook and widget tests</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Orders including this product
            </h2>
            <p className="text-sm text-slate-400">
              Synced from backend contract via REST endpoints
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
            {relatedOrders.length} linked
          </span>
        </header>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {relatedOrders.map((order) => {
                  const totalQuantity = order.lineItems
                    .filter((item) => item.productId === product.id)
                    .reduce((total, item) => total + item.quantity, 0);
                  return (
                    <tr key={order.id} className="transition hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">
                        {order.id}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">{totalQuantity}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(order.total, order.currency)}
                      </td>
                    </tr>
                  );
                })}
                {relatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-slate-400"
                    >
                      No orders currently include this product.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-200 border-amber-500/40",
    processing: "bg-sky-500/20 text-sky-200 border-sky-500/40",
    fulfilled: "bg-teal-500/20 text-teal-100 border-teal-400/40",
    cancelled: "bg-rose-500/20 text-rose-200 border-rose-500/40",
    active: "bg-teal-500/20 text-teal-100 border-teal-400/40",
    draft: "bg-amber-500/20 text-amber-100 border-amber-500/40",
    archived: "bg-slate-600/30 text-slate-200 border-slate-500/40",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] ?? ""}`}
    >
      {status}
    </span>
  );
}
