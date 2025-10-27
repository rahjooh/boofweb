import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getStorefrontBlogPosts } from "@/lib/api-client";
import { mockBlogPosts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

interface StorefrontBlogPageProps {
  params: Promise<{ producerId: string }>;
}

export async function generateStaticParams() {
  const producers = new Set(mockBlogPosts.map((post) => post.producerId));
  if (producers.size === 0) {
    producers.add("Boofshop");
  }
  return Array.from(producers).map((producerId) => ({ producerId }));
}

export async function generateMetadata({
  params,
}: StorefrontBlogPageProps): Promise<Metadata> {
  const { producerId } = await params;
  const posts = await getStorefrontBlogPosts(producerId).catch(() => []);
  const description =
    posts[0]?.excerpt ?? "Latest stories from the Boofshop team.";
  const title = `${capitalize(producerId)} blog`;
  return {
    title,
    description,
    alternates: {
      canonical: `/store/${producerId}/blog`,
    },
  };
}

export default async function StorefrontBlogPage({
  params,
}: StorefrontBlogPageProps) {
  const { producerId } = await params;
  const posts = await getStorefrontBlogPosts(producerId);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center rounded-full border border-teal-400/50 bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-teal-100">
            {producerId}
          </span>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Stories from the Boofshop producers
          </h1>
          <p className="text-base text-slate-200">
            Field notes, product updates, and playbooks shipped directly from
            our validator operators.
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
                <title>بینش هفتگی</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2"
                />
              </svg>
              Weekly insights
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
                <title>مصاحبه‌های اپراتوری</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16m-7 5h7"
                />
              </svg>
              Operator interviews
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
                <title>آمادگی عرضه</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l2.5 2"
                />
              </svg>
              Launch readiness
            </span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_60%)]" />
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white">Latest posts</h2>
          <p className="text-sm text-slate-400">
            Subscribe for deep dives across custody, staking, and payment rails.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60"
            >
              {post.coverImageUrl ? (
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover opacity-90"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    loading="lazy"
                    unoptimized
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-teal-200">
                    <span>{post.tags[0] ?? "update"}</span>
                    <span className="text-slate-500">•</span>
                    <span>
                      {formatDate(post.publishedAt ?? post.updatedAt)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-300">{post.excerpt}</p>
                </div>
                <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                  <Link
                    href={`/store/${producerId}/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-200 hover:text-white"
                  >
                    Read post
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <title>خواندن مطلب</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                  <span>
                    {post.tags
                      .slice(1)
                      .map((tag) => `#${tag}`)
                      .join(" ")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-slate-950/60 p-12 text-center text-sm text-slate-400">
            No published posts yet. Check back after the next release cycle.
          </div>
        ) : null}
      </section>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
