"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { getProducts } from "@/lib/api-client";
import { useUnauthorizedRedirect } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ProductsViewProps {
  initialData: Product[];
}

export function ProductsView({ initialData }: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const {
    data: products,
    isFetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData,
  });

  useUnauthorizedRedirect(isError ? error : null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter
        ? product.status === statusFilter
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/60 p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-white">Product catalog</h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Review live products coming from the Go backend. Search and filter
            by publishing state, inspect inventory readiness, and plan
            coordinated releases with mobile clients.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
            placeholder="Search catalog"
            aria-label="Search catalog"
          />
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
            {(["active", "draft", "archived"] as const).map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(active ? null : status)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-teal-500/20 text-teal-100 shadow-[0_0_0_1px_rgba(45,212,191,0.35)]"
                      : "text-slate-300 hover:text-white"
                  }`}
                  type="button"
                >
                  {status}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => refetch()}
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 font-medium text-white/80 hover:border-teal-400/40 hover:text-white"
          >
            Refresh
          </button>
          {isFetching ? (
            <span className="text-xs text-teal-200">Syncing…</span>
          ) : null}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">
                  {product.name}
                </h2>
                <StatusPill status={product.status ?? "draft"} />
              </div>
              <p className="text-sm text-slate-300">{product.description}</p>
              <dl className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div>
                  <dt>Last updated</dt>
                  <dd className="text-sm text-slate-200">
                    {formatDate(product.updatedAt)}
                  </dd>
                </div>
                <div>
                  <dt>Inventory</dt>
                  <dd className="text-sm text-slate-200">
                    {product.stock ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd className="text-sm font-medium text-slate-100">
                    {formatCurrency(product.price, product.currency)}
                  </dd>
                </div>
                <div>
                  <dt>Tags</dt>
                  <dd className="text-sm text-slate-200">
                    {product.tags?.length ? product.tags.join(", ") : "—"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex items-center justify-between">
              <LinkButton href={`/products/${product.id}`}>
                Open detail
              </LinkButton>
              <span className="text-xs text-slate-500">ID: {product.id}</span>
            </div>
          </article>
        ))}
      </section>
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-slate-950/40 p-12 text-center text-sm text-slate-400">
          No products match the current filters. Try adjusting search keywords
          or status filters.
        </div>
      ) : null}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
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

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:border-teal-400/40 hover:text-white"
    >
      {children}
    </Link>
  );
}
