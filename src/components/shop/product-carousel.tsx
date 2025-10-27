"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const activeProducts = useMemo(
    () => products.filter((product) => product.status !== "archived"),
    [products],
  );
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const handleScroll = () => {
      const max = container.scrollWidth - container.clientWidth;
      if (max <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Number((container.scrollLeft / max).toFixed(2)));
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = sliderRef.current;
    if (!container) return;
    const step = container.offsetWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (activeProducts.length === 0) {
    return (
      <section className="rounded-[2.5rem] border border-white/10 bg-white/80 p-10 text-center text-slate-600 shadow-lg dark:border-white/5 dark:bg-slate-900/80 dark:text-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          محصولات به‌زودی در دسترس خواهند بود
        </h2>
        <p className="mt-3 text-sm">
          تیم تدارکات ما در حال آماده‌سازی موجودی تازه است. همین صفحه را برای
          اطلاع از موجود شدن محصولات بررسی کنید.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8 rounded-[3rem] border border-rose-200/60 bg-white/80 p-8 shadow-[0_30px_80px_rgba(248,113,113,0.16)] dark:border-white/5 dark:bg-slate-950/70">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50/70 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-rose-500 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-100">
            محصولات پرفروش
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            بهترین انتخاب‌های جامعه پت‌لاور فارسی
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-200">
            محصولات فعال مستقیماً از سرویس بک‌اند دریافت می‌شوند تا همیشه آخرین
            قیمت‌ها و موجودی را مشاهده کنید. کارت‌ها برای مرور افقی طراحی شده‌اند؛
            برای مشاهده جزئیات بیشتر هر محصول را انتخاب کنید.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:-translate-x-0.5 hover:border-rose-300 hover:text-rose-600 disabled:opacity-40 dark:border-white/10 dark:bg-slate-900 dark:text-rose-200"
            aria-label="مشاهده محصولات قبلی"
            disabled={progress <= 0}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <title>پیمایش به عقب</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15 6-6 6 6 6"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:translate-x-0.5 hover:border-rose-300 hover:text-rose-600 disabled:opacity-40 dark:border-white/10 dark:bg-slate-900 dark:text-rose-200"
            aria-label="مشاهده محصولات بعدی"
            disabled={progress >= 0.98}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <title>پیمایش به جلو</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 6 6 6-6 6"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="relative">
        <div
          ref={sliderRef}
          className="group flex gap-6 overflow-x-auto scroll-smooth px-2 pb-6 [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {activeProducts.map((product) => (
            <article
              key={product.id}
              className="relative flex w-[260px] shrink-0 snap-center flex-col justify-between rounded-[2rem] border border-white/40 bg-gradient-to-br from-white via-rose-50/70 to-amber-50/60 p-6 shadow-[0_20px_60px_rgba(244,63,94,0.12)] transition hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(244,63,94,0.16)] dark:border-white/10 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-rose-400 dark:text-rose-200">
                  <span className="rounded-full border border-rose-200/60 bg-white/60 px-3 py-1 font-semibold text-rose-500 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
                    محصول فعال
                  </span>
                  <span className="font-medium text-slate-400 dark:text-slate-200">
                    {product.stock ? `${product.stock} عدد موجود` : "موجود"}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200">
                  {product.description}
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-baseline justify-between text-rose-500 dark:text-rose-200">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em]">
                    قیمت
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                >
                  افزودن به سبد خرید
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                  >
                    <title>افزودن به سبد</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l3-7H5.4M7 13l-1.293 2.586A1 1 0 0 0 6.618 17H18m-6 0v3m0-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white/90 dark:to-slate-950" />
      </div>

      <div className="mx-auto flex w-full max-w-md items-center gap-3 text-xs text-slate-500 dark:text-slate-300">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-rose-100 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-rose-500 transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(progress, 0.08) * 100}%` }}
          />
        </div>
        <span className="font-semibold">
          {activeProducts.length} محصول فعال
        </span>
      </div>
    </section>
  );
}
