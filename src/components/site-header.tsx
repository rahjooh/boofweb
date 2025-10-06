"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { logout } from "@/lib/api-client";
import { AUTH_QUERY_KEY, useAuth } from "@/lib/auth";
import { getDefaultProducerId } from "@/lib/env";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const authQuery = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const previousPathname = useRef(pathname);
  const defaultProducerId = getDefaultProducerId();
  const navItems = useMemo(() => {
    const items = [
      { href: "/", label: "Overview" },
      { href: "/products", label: "Products" },
      { href: `/store/${defaultProducerId}/blog`, label: "Blog" },
    ];

    const role = authQuery.data?.role;
    const isProducer = role === "producer" || role === "admin";

    if (isProducer) {
      items.push({
        href: `/producers/${defaultProducerId}/blog`,
        label: "Blog console",
      });
    }

    if (role === "admin") {
      items.push({ href: "/orders", label: "Orders" });
    }

    return items;
  }, [authQuery.data?.role, defaultProducerId]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY }).catch(() => {
        // noop: query will idle without auth
      });
      router.push("/login");
      setIsMenuOpen(false);
    },
  });

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const desktopNav = useMemo(
    () => (
      <nav className="hidden items-center gap-2 text-sm font-medium text-slate-300 md:flex">
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="cursor-not-allowed rounded-full px-4 py-2 text-slate-600"
                aria-disabled
              >
                {item.label}
              </span>
            );
          }

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "rounded-full px-4 py-2 transition",
                isActive
                  ? "bg-teal-500/20 text-teal-200 shadow-[0_0_0_1px_rgba(45,212,191,0.4)]"
                  : "hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    ),
    [navItems, pathname],
  );

  const renderAuthControls = (showNameOnMobile: boolean) => (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
      {authQuery.isLoading ? (
        <span className="rounded-full border border-white/5 px-4 py-1 text-slate-400">
          Checking auth…
        </span>
      ) : authQuery.data ? (
        <>
          <span
            className={clsx(
              "text-slate-400",
              showNameOnMobile ? "inline" : "hidden md:inline",
            )}
          >
            {authQuery.data.name}
          </span>
          <Link
            href="/account"
            className="rounded-full border border-white/10 px-4 py-1 text-sm font-medium text-white/80 transition hover:border-teal-400/40 hover:text-white"
          >
            Account
          </Link>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="rounded-full border border-white/10 px-4 py-1 text-sm font-medium text-white/80 transition hover:border-teal-400/40 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-full border border-white/10 px-4 py-1 text-sm font-medium text-white/80 transition hover:border-teal-400/40 hover:text-white"
        >
          Sign in
        </Link>
      )}
    </div>
  );

  return (
    <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-white"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-sm font-bold text-teal-300">
            CT
          </span>
          Boofshop Console
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-teal-400/40 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              aria-hidden
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <title>Open menu</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
          {desktopNav}
          <div className="hidden md:flex">{renderAuthControls(false)}</div>
        </div>
      </div>
      <div
        className={clsx(
          "md:hidden",
          isMenuOpen ? "border-t border-white/10 bg-slate-950/95" : "hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:px-10">
          <nav className="flex flex-col gap-2 text-sm font-medium text-slate-200">
            {navItems.map((item) => {
              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="cursor-not-allowed rounded-2xl border border-white/10 px-4 py-2 text-slate-600"
                    aria-disabled
                  >
                    {item.label}
                  </span>
                );
              }

              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    "rounded-2xl border px-4 py-2 transition",
                    isActive
                      ? "border-teal-400/40 bg-teal-500/20 text-teal-100"
                      : "border-white/10 bg-white/5 text-slate-200 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div>{renderAuthControls(true)}</div>
        </div>
      </div>
    </header>
  );
}
