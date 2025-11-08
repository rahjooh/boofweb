import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStorefrontBlogPost,
  getStorefrontBlogPosts,
} from "@/lib/api-client";
import { markdownToHtml } from "@/lib/markdown";
import { mockBlogPosts } from "@/lib/mock-data";
import { formatDate, getProducerDisplayName } from "@/lib/utils";

export const revalidate = 300;

interface StorefrontBlogPostPageProps {
  params: Promise<{ producerId: string; slug: string }>;
}

export async function generateStaticParams() {
  return mockBlogPosts
    .filter((post) => !post.isDraft)
    .map((post) => ({ producerId: post.producerId, slug: post.slug }));
}

export async function generateMetadata({
  params,
}: StorefrontBlogPostPageProps): Promise<Metadata> {
  const { producerId, slug } = await params;
  const producerName = getProducerDisplayName(producerId);
  try {
    const post = await getStorefrontBlogPost(producerId, slug);
    if (!post) {
      return { title: "مطلب وبلاگ" };
    }
    return {
      title: `${post.title} · وبلاگ ${producerName}`,
      description: post.excerpt,
      alternates: {
        canonical: `/store/${producerId}/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `/store/${producerId}/blog/${post.slug}`,
        images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      },
      twitter: {
        card: post.coverImageUrl ? "summary_large_image" : "summary",
        title: post.title,
        description: post.excerpt,
        images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      },
    };
  } catch (_error) {
    return { title: "مطلب وبلاگ" };
  }
}

export default async function StorefrontBlogPostPage({
  params,
}: StorefrontBlogPostPageProps) {
  const { producerId, slug } = await params;
  const post = await getStorefrontBlogPost(producerId, slug);
  if (!post || post.isDraft) {
    notFound();
  }

  const html = markdownToHtml(post.contentMarkdown);
  const related = await getStorefrontBlogPosts(producerId).catch(() => []);
  const recent = related.filter((item) => item.slug !== post.slug).slice(0, 3);
  const producerName = getProducerDisplayName(producerId);

  return (
    <div className="space-y-10">
      <nav className="text-xs text-slate-400">
        <Link
          href={`/store/${producerId}/blog`}
          className="inline-flex items-center gap-2 text-teal-200 hover:text-white"
        >
          بازگشت به وبلاگ ←
        </Link>
      </nav>
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-teal-200">
          <span>{producerName}</span>
          <span className="text-slate-500">•</span>
          <span>{formatDate(post.publishedAt ?? post.updatedAt)}</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          {post.title}
        </h1>
        <p className="text-base text-slate-300">{post.excerpt}</p>
        {post.coverImageUrl ? (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              width={1200}
              height={320}
              className="h-[320px] w-full object-cover"
              priority
              unoptimized
            />
          </div>
        ) : null}
      </header>
      <article
        className="space-y-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {recent.length ? (
        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <h2 className="text-xl font-semibold text-white">
            مطالب بیشتر از {producerName}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/store/${producerId}/blog/${item.slug}`}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-teal-400/40 hover:text-white"
              >
                <span className="text-xs uppercase tracking-[0.35em] text-teal-200">
                  {item.tags[0] ?? "به‌روزرسانی"}
                </span>
                <span className="text-base font-semibold text-white">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(item.publishedAt ?? item.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
