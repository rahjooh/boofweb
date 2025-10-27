import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogSpotlight({
  posts,
  producerId,
}: {
  posts: BlogPost[];
  producerId: string;
}) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="rounded-[32px] border border-white/80 bg-white px-6 py-12 shadow-xl shadow-rose-100/40 sm:px-10">
      <div className="flex flex-col gap-4 text-right sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            از مجله تربیت و تغذیه
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            نکات علمی، برنامه‌های تمرینی و دستور پخت خوراک‌های خانگی که توسط تیم
            محتوا و دامپزشکان ما تهیه شده است.
          </p>
        </div>
        <Link
          href={`/store/${producerId}/blog`}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white"
        >
          مطالعه مقالات بیشتر
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex h-full flex-col rounded-3xl border border-rose-100 bg-rose-50/60 p-6 text-right shadow-sm shadow-rose-100"
          >
            <span className="text-xs font-semibold text-rose-500">
              {post.tags[0] ?? "تغذیه سالم"}
            </span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {post.excerpt}
            </p>
            <time
              className="mt-4 text-xs text-slate-500"
              dateTime={post.publishedAt ?? post.createdAt}
            >
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
            <Link
              href={`/store/${post.producerId}/blog/${post.slug}`}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              ادامه مطلب
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
