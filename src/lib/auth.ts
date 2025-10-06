"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  getCurrentUser,
  isForbiddenError,
  isUnauthorizedError,
} from "./api-client";
import type { User } from "./types";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

function buildLoginRedirectTarget(
  pathname: string,
  searchParams?: URLSearchParams | null,
) {
  if (!pathname || pathname === "/login") {
    return "/login";
  }
  const nextPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
  const params = new URLSearchParams({ next: nextPath });
  return `/login?${params.toString()}`;
}

export function useAuth() {
  return useQuery<User | null, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (error) {
        if (isUnauthorizedError(error) || isForbiddenError(error)) {
          return null;
        }
        throw error instanceof Error
          ? error
          : new Error("Unable to load authenticated user");
      }
    },
    staleTime: 1000 * 60,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUnauthorizedRedirect(error: unknown, customTarget?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (redirectedRef.current) {
      return;
    }
    if (!error || (!isUnauthorizedError(error) && !isForbiddenError(error))) {
      return;
    }

    redirectedRef.current = true;

    const target = customTarget
      ? customTarget
      : buildLoginRedirectTarget(pathname ?? "/", searchParams);

    router.push(target);
  }, [customTarget, error, pathname, router, searchParams]);
}
