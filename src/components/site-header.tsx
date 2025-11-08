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
    const items: Array<{
      href: string;
      label: string;
      disabled?: boolean;
    }> = [
      { href: "/", label: "خانه" },
      { href: "/products", label: "محصولات" },
      { href: "/#membership", label: "باشگاه سلامت" },
      { href: `/store/${defaultProducerId}/blog`, label: "مجله تربیت" },
    ];

    const role = authQuery.data?.role;
    const isProducer = role === "producer" || role === "admin";

    if (isProducer) {
      items.push({
        href: `/producers/${defaultProducerId}/blog`,
        label: "مدیریت وبلاگ",
      });
    }

    if (role === "admin") {
      items.push({ href: "/orders", label: "سفارش‌ها" });
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
      <nav className="hidden items-center gap-2 text-sm font-semibold text-slate-700 md:flex">
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="cursor-not-allowed rounded-full px-4 py-2 text-slate-400"
                aria-disabled
              >
                {item.label}
              </span>
            );
          }

          const hrefWithoutHash = item.href.split("#")[0];
          const isActive =
            pathname === hrefWithoutHash ||
            (hrefWithoutHash !== "/" && pathname.startsWith(hrefWithoutHash));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "rounded-full px-4 py-2 transition",
                isActive
                  ? "bg-emerald-500/10 text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]"
                  : "hover:bg-emerald-100/60 hover:text-emerald-700",
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
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
      {authQuery.isLoading ? (
        <span className="rounded-full border border-emerald-100 px-4 py-1 text-slate-500">
          در حال بررسی حساب...
        </span>
      ) : authQuery.data ? (
        <>
          <span
            className={clsx(
              "text-slate-500",
              showNameOnMobile ? "inline" : "hidden md:inline",
            )}
          >
            {authQuery.data.name}
          </span>
          <Link
            href="/account"
            className="rounded-full border border-emerald-200 px-4 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            حساب کاربری
          </Link>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="rounded-full border border-emerald-200 px-4 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-emerald-100 disabled:text-slate-400"
          >
            {logoutMutation.isPending ? "در حال خروج..." : "خروج"}
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-full border border-emerald-200 px-4 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          ورود / ثبت‌نام
        </Link>
      )}
    </div>
  );

  return (
    <header className="border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-extrabold text-slate-900"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-lg text-emerald-600">
            🐾
          </span>
          بوف 
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 md:hidden"
            aria-label="تغییر وضعیت منوی ناوبری"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">باز کردن منو</span>
            <svg
              aria-hidden
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <title>Toggle menu</title>
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
          isMenuOpen ? "border-t border-emerald-100 bg-white" : "hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:px-10">
          <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            {navItems.map((item) => {
              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="cursor-not-allowed rounded-2xl border border-emerald-100 px-4 py-2 text-slate-400"
                    aria-disabled
                  >
                    {item.label}
                  </span>
                );
              }

              const hrefWithoutHash = item.href.split("#")[0];
              const isActive =
                pathname === hrefWithoutHash ||
                (hrefWithoutHash !== "/" &&
                  pathname.startsWith(hrefWithoutHash));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    "rounded-2xl border px-4 py-2 transition",
                    isActive
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                      : "border-emerald-100 bg-white/60 text-slate-700 hover:text-emerald-700",
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
