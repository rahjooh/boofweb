import { cookies } from "next/headers";
import { Suspense } from "react";
import {
  getCurrentUser,
  getProducts,
  isForbiddenError,
  isUnauthorizedError,
} from "@/lib/api-client";
import { mockProducts } from "@/lib/mock-data";
import type { User } from "@/lib/types";
import { ProductsView } from "./products-view";
import { PublicProductsView } from "./public-products-view";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;

  let currentUser: User | null = null;
  try {
    currentUser = await getCurrentUser(init);
  } catch (error) {
    if (!isUnauthorizedError(error) && !isForbiddenError(error)) {
      throw error;
    }
  }

  let products = mockProducts;
  try {
    products = await getProducts(init);
  } catch (error) {
    if (!isUnauthorizedError(error) && !isForbiddenError(error)) {
      throw error;
    }
  }

  const isAdmin = currentUser?.role === "admin";

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="text-sm text-slate-400">Loading products…</div>
        }
      >
        <ProductsView initialData={products} />
      </Suspense>
    );
  }

  return <PublicProductsView products={products} />;
}
