"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PublicProductsViewProps {
  products: Product[];
}

type SortOption = "featured" | "price-low-high" | "price-high-low" | "newest";

export function PublicProductsView({ products }: PublicProductsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("featured");

  const activeProducts = useMemo(
    () => products.filter((product) => product.status !== "archived"),
    [products],
  );

  const tags = useMemo(() => {
    const unique = new Set<string>();
    for (const product of activeProducts) {
      for (const tag of product.tags ?? []) {
        unique.add(tag);
      }
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [activeProducts]);

  const filtered = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesSearch = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => product.tags?.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [activeProducts, search, selectedTags]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "price-low-high") {
        return a.price - b.price;
      }
      if (sort === "price-high-low") {
        return b.price - a.price;
      }
      if (sort === "newest") {
        return (
          new Date(b.updatedAt ?? b.createdAt ?? Date.now()).getTime() -
          new Date(a.updatedAt ?? a.createdAt ?? Date.now()).getTime()
        );
      }
      return (
        new Date(b.updatedAt ?? b.createdAt ?? Date.now()).getTime() -
        new Date(a.updatedAt ?? a.createdAt ?? Date.now()).getTime()
      );
    });
  }, [filtered, sort]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-10">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-teal-100">
              Catalog
            </span>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Discover products engineered for modern crypto commerce
            </h1>
            <p className="text-base text-slate-200">
              Explore ready-to-ship hardware, staking infrastructure, and SaaS
              analytics curated by the Boofshop team.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <title>ارسال سریع</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2"
                  />
                </svg>
                Ready to ship in 48h
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <title>روش‌های پرداخت انعطاف‌پذیر</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16m-7 5h7"
                  />
                </svg>
                Flexible payment options
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <title>پشتیبانی شبانه‌روزی</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l2.5 2"
                  />
                </svg>
                24/7 operator support
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Updated
            </span>
            <span className="text-lg font-semibold text-white">
              {formatDate(
                sorted[0]?.updatedAt ??
                  sorted[0]?.createdAt ??
                  new Date().toISOString(),
              )}
            </span>
            <p className="text-xs text-slate-400">
              Catalog refreshed with the latest inventory and validator builds.
            </p>
            <Link
              href="#catalog"
              className="inline-flex items-center justify-center rounded-full border border-teal-400/60 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-100 transition hover:border-teal-300 hover:text-white"
            >
              Browse collection
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_60%)]" />
      </section>

      <section id="catalog" className="space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Catalog</h2>
            <p className="text-sm text-slate-400">
              Filter by tag, search by name, or sort by price to find your next
              release.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="flex-1 md:flex-none">
              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <title>جستجوی محصولات</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19 19-3.5-3.5M4 11a7 7 0 1 0 14 0 7 7 0 0 0-14 0Z"
                  />
                </svg>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="peer w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  placeholder="Search hardware, staking, analytics"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-400">
              Sort
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200 focus:border-teal-400/40 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to high</option>
                <option value="price-high-low">Price: High to low</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>
        </header>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-xs">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-4 py-2 font-semibold transition ${
                    active
                      ? "border-teal-400/50 bg-teal-500/20 text-teal-100 shadow-[0_0_0_1px_rgba(45,212,191,0.35)]"
                      : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTags.length > 0 ? (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="rounded-full border border-white/10 bg-transparent px-4 py-2 font-semibold text-slate-200 hover:border-teal-400/40 hover:text-white"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((product) => (
            <article
              key={product.id}
              className="group flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-teal-400/20 hover:shadow-[0_20px_50px_-20px_rgba(15,118,110,0.4)]"
            >
              <header className="space-y-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">
                  {product.tags?.[0] ?? "Featured"}
                </span>
                <h3 className="text-2xl font-semibold text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-300">{product.description}</p>
              </header>

              <dl className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    Price
                  </dt>
                  <dd className="text-lg font-semibold text-white">
                    {formatCurrency(product.price, product.currency)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    Availability
                  </dt>
                  <dd className="text-sm font-medium text-teal-100">
                    {product.stock ? `${product.stock} in stock` : "Limited"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    Updated
                  </dt>
                  <dd>{formatDate(product.updatedAt ?? product.createdAt)}</dd>
                </div>
              </dl>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href={`/login?next=/products/${product.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-teal-400/40 hover:text-white"
                >
                  Operator detail
                  <svg
                    aria-hidden="true"
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <title>جزئیات بیشتر</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-teal-400/60 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-100 transition hover:border-teal-300 hover:text-white"
                >
                  Add to launch list
                </button>
              </div>
            </article>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-slate-950/60 p-12 text-center text-sm text-slate-400">
            No products match your filters yet. Try adjusting keywords or tag
            selections.
          </div>
        ) : null}
      </section>
    </div>
  );
}
