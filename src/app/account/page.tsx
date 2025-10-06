import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAddresses,
  getCurrentUser,
  isForbiddenError,
  isNotFoundError,
  isUnauthorizedError,
} from "@/lib/api-client";
import type { Address, User } from "@/lib/types";
import { AccountDashboard } from "./account-dashboard";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;

  let user: User;
  try {
    user = await getCurrentUser(init);
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

  let addresses: Address[] = [];
  try {
    addresses = await getAddresses(init);
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      redirect("/login");
    }
  }

  return <AccountDashboard user={user} initialAddresses={addresses} />;
}
