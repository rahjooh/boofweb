"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getOrders } from "@/lib/api-client";
import { useUnauthorizedRedirect } from "@/lib/auth";
import type { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface OrdersViewProps {
  initialData: Order[];
}

const statusOptions = [
  "pending",
  "processing",
  "fulfilled",
  "cancelled",
] as const;

export function OrdersView({ initialData }: OrdersViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const {
    data: orders,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    initialData,
  });

  useUnauthorizedRedirect(isError ? error : null);

  const filteredOrders = useMemo(() => {
    return selectedStatus
      ? orders.filter((order) => order.status === selectedStatus)
      : orders;
  }, [orders, selectedStatus]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-white">
              Order operations
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Inspect commerce events from the Go backend, validate fulfilment
              flows, and coordinate messaging with mobile releases. Filters
              support rapid QA when iterating on contract changes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            {statusOptions.map((status) => {
              const active = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(active ? null : status)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-teal-400/40 bg-teal-500/20 text-teal-100 shadow-[0_0_0_1px_rgba(45,212,191,0.35)]"
                      : "border-white/10 bg-white/5 text-slate-200 hover:text-white"
                  }`}
                  type="button"
                >
                  {status}
                </button>
              );
            })}
            {isFetching ? (
              <span className="text-xs text-teal-200">Syncing…</span>
            ) : null}
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-950/60">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="transition hover:bg-white/5">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{order.id}</div>
                    <div className="text-xs text-slate-400">
                      {order.lineItems.length} items
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{order.userId}</td>
                  <td className="px-5 py-4 text-slate-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-slate-100">
                    {formatCurrency(order.total, order.currency)}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-slate-400"
                  >
                    No orders found for this status filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
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
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] ?? ""}`}
    >
      {status}
    </span>
  );
}
