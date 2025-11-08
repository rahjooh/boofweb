import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  getCurrentUser,
  getOrders,
  isForbiddenError,
  isNotFoundError,
  isUnauthorizedError,
} from "@/lib/api-client";
import { OrdersView } from "./orders-view";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;

  try {
    const currentUser = await getCurrentUser(init);
    if (currentUser.role !== "admin") {
      redirect("/login");
    }

    const orders = await getOrders(init);

    return (
      <Suspense
        fallback={<div className="text-sm text-slate-400">Loading orders…</div>}
      >
        <OrdersView initialData={orders} />
      </Suspense>
    );
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
}
