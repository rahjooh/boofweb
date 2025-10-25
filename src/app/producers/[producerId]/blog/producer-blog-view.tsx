"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useMemo,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  createProducerBlogPost,
  deleteProducerBlogPost,
  getProducerBlogInsights,
  getProducerBlogPosts,
  updateProducerBlogPost,
} from "@/lib/api-client";
import { useUnauthorizedRedirect } from "@/lib/auth";
import type { BlogInsightsSummary, BlogPost, BlogPostInput } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/toast-provider";

interface ProducerBlogViewProps {
  producerId: string;
  initialPosts: BlogPost[];
  initialInsights: BlogInsightsSummary;
}

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  tagsInput: string;
  contentMarkdown: string;
  publish: boolean;
};

type SelectedKey = "new" | string;

export function ProducerBlogView({
  producerId,
  initialPosts,
  initialInsights,
}: ProducerBlogViewProps) {
  const postsQueryKey = ["producer-blog-posts", producerId] as const;
  const insightsQueryKey = ["producer-blog-insights", producerId] as const;
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const [selectedId, setSelectedId] = useState<SelectedKey>(
    initialPosts[0]?.id ?? "new",
  );
  const [formState, setFormState] = useState<FormState>(() =>
    initialPosts[0]
      ? mapPostToForm(initialPosts[0])
      : createEmptyFormState(),
  );

  const postsQuery = useQuery({
    queryKey: postsQueryKey,
    queryFn: () => getProducerBlogPosts(producerId),
    initialData: initialPosts,
  });

  const insightsQuery = useQuery({
    queryKey: insightsQueryKey,
    queryFn: () => getProducerBlogInsights(producerId),
    initialData: initialInsights,
  });

  useUnauthorizedRedirect(postsQuery.isError ? postsQuery.error : null);
  useUnauthorizedRedirect(insightsQuery.isError ? insightsQuery.error : null);

  const posts = postsQuery.data ?? [];
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [posts]);

  const currentPost =
    selectedId === "new"
      ? undefined
      : sortedPosts.find((post) => post.id === selectedId);
  const isNew = selectedId === "new";

  useEffect(() => {
    if (isNew) {
      setFormState(createEmptyFormState());
      return;
    }
    if (currentPost) {
      setFormState(mapPostToForm(currentPost));
    }
  }, [currentPost, isNew]);

  const handleFieldChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState((previous) => ({ ...previous, [field]: value }));
    };

  const handlePublishToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormState((previous) => ({ ...previous, publish: checked }));
  };

  const createMutation = useMutation({
    mutationFn: (input: BlogPostInput) =>
      createProducerBlogPost(producerId, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey });
      const previous = queryClient.getQueryData<BlogPost[]>(postsQueryKey) ?? [];
      const now = new Date().toISOString();
      const tempId = `temp-${Math.random().toString(16).slice(2)}`;
      const slug = input.slug ?? slugify(input.title);
      const optimistic: BlogPost = {
        id: tempId,
        producerId,
        title: input.title,
        slug,
        excerpt: input.excerpt,
        contentMarkdown: input.contentMarkdown,
        coverImageUrl: input.coverImageUrl ?? null,
        tags: input.tags,
        isDraft: !(input.publish ?? false),
        publishedAt: input.publish ? now : null,
        createdAt: now,
        updatedAt: now,
      };
      queryClient.setQueryData(postsQueryKey, [optimistic, ...previous]);
      setSelectedId(tempId);
      return { previous, tempId };
    },
    onError: (error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postsQueryKey, context.previous);
      }
      pushToast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : undefined,
        kind: "error",
      });
    },
    onSuccess: (post, _input, context) => {
      queryClient.setQueryData(postsQueryKey, (current?: BlogPost[]) => {
        const items = current ?? [];
        return items.map((item) => (item.id === context?.tempId ? post : item));
      });
      setSelectedId(post.id);
      pushToast({
        title: post.isDraft ? "Draft saved" : "Post published",
        kind: post.isDraft ? "info" : "success",
      });
      queryClient.invalidateQueries({ queryKey: insightsQueryKey }).catch(() => {
        // ignore
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: { payload: BlogPostInput; postId: string }) =>
      updateProducerBlogPost(producerId, input.postId, input.payload),
    onMutate: async ({ postId, payload }) => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey });
      const previous = queryClient.getQueryData<BlogPost[]>(postsQueryKey) ?? [];
      const now = new Date().toISOString();
      queryClient.setQueryData(postsQueryKey, (current?: BlogPost[]) => {
        const items = current ?? [];
        return items.map((post) =>
          post.id === postId
            ? {
                ...post,
                title: payload.title,
                slug: payload.slug ?? post.slug,
                excerpt: payload.excerpt,
                contentMarkdown: payload.contentMarkdown,
                coverImageUrl:
                  payload.coverImageUrl !== undefined
                    ? payload.coverImageUrl
                    : post.coverImageUrl,
                tags: payload.tags,
                isDraft:
                  typeof payload.publish === "undefined"
                    ? post.isDraft
                    : !payload.publish,
                publishedAt:
                  payload.publish === undefined
                    ? post.publishedAt
                    : payload.publish
                      ? now
                      : null,
                updatedAt: now,
              }
            : post,
        );
      });
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postsQueryKey, context.previous);
      }
      pushToast({
        title: "Failed to update post",
        description: error instanceof Error ? error.message : undefined,
        kind: "error",
      });
    },
    onSuccess: (post) => {
      queryClient.setQueryData(postsQueryKey, (current?: BlogPost[]) => {
        const items = current ?? [];
        return items.map((item) => (item.id === post.id ? post : item));
      });
      pushToast({
        title: post.isDraft ? "Draft updated" : "Post updated",
        kind: post.isDraft ? "info" : "success",
      });
      queryClient.invalidateQueries({ queryKey: insightsQueryKey }).catch(() => {
        // ignore
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deleteProducerBlogPost(producerId, postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey });
      const previous = queryClient.getQueryData<BlogPost[]>(postsQueryKey) ?? [];
      queryClient.setQueryData(
        postsQueryKey,
        previous.filter((post) => post.id !== postId),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postsQueryKey, context.previous);
      }
      pushToast({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : undefined,
        kind: "error",
      });
    },
    onSuccess: () => {
      pushToast({
        title: "Post deleted",
        kind: "success",
      });
      queryClient.invalidateQueries({ queryKey: insightsQueryKey }).catch(() => {
        // ignore
      });
      setSelectedId((current) => {
        const remaining = queryClient.getQueryData<BlogPost[]>(postsQueryKey) ?? [];
        return remaining[0]?.id ?? "new";
      });
    },
  });

  const insights = insightsQuery.data ?? initialInsights;

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const canSave =
    formState.title.trim() !== "" &&
    formState.excerpt.trim() !== "" &&
    formState.contentMarkdown.trim() !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayloadFromForm(formState, currentPost);
    if (isNew) {
      createMutation.mutate(payload);
    } else if (currentPost) {
      updateMutation.mutate({ postId: currentPost.id, payload });
    }
  };

  const handleDelete = () => {
    if (!currentPost) {
      return;
    }
    if (!window.confirm(`Delete “${currentPost.title}”? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(currentPost.id);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white">
              Producer blog console
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Manage draft and published articles, track publishing cadence, and
              keep operators aligned with storefront messaging.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm text-slate-200 sm:grid-cols-4">
            <InsightStat label="Total" value={insights.totalPosts} />
            <InsightStat label="Published" value={insights.publishedPosts} />
            <InsightStat label="Drafts" value={insights.draftPosts} />
            <InsightStat
              label="Last publish"
              value={insights.lastPublishedAt ? formatDate(insights.lastPublishedAt) : "—"}
            />
          </div>
        </header>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
        <aside className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Posts</h2>
            <button
              type="button"
              onClick={() => setSelectedId("new")}
              className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold text-white/80 transition hover:border-teal-400/40 hover:text-white"
            >
              New post
            </button>
          </div>
          <div className="space-y-2">
            {sortedPosts.map((post) => {
              const active = post.id === selectedId;
              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSelectedId(post.id)}
                  className={
                    active
                      ? "w-full rounded-2xl border border-teal-400/40 bg-teal-500/20 px-4 py-3 text-left text-sm text-teal-100"
                      : "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:text-white"
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white">{post.title}</span>
                    <StatusBadge isDraft={post.isDraft} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Updated {formatDate(post.updatedAt)}
                  </p>
                  {post.tags.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <TagPill key={tag} label={tag} />
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
            {sortedPosts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center text-xs text-slate-400">
                No posts yet. Create your first draft to kick things off.
              </p>
            ) : null}
          </div>
        </aside>

        <article className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <header className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-white">
                  {isNew ? "New post" : "Edit post"}
                </h2>
                {!isNew ? <StatusBadge isDraft={currentPost?.isDraft ?? true} /> : null}
              </div>
              <p className="text-xs text-slate-400">
                {isNew
                  ? "Draft your announcement, add tags, then publish when ready."
                  : "Update the markdown content and toggle publish state as needed."}
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="font-medium text-slate-100">Title</span>
                <input
                  value={formState.title}
                  onChange={handleFieldChange("title")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder="Announce your next launch"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="font-medium text-slate-100">Slug</span>
                <input
                  value={formState.slug}
                  onChange={handleFieldChange("slug")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder="optional-custom-slug"
                />
              </label>
              <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                <span className="font-medium text-slate-100">Excerpt</span>
                <textarea
                  value={formState.excerpt}
                  onChange={handleFieldChange("excerpt")}
                  className="min-h-[80px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder="Short summary displayed on storefront"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="font-medium text-slate-100">Cover image URL</span>
                <input
                  value={formState.coverImageUrl}
                  onChange={handleFieldChange("coverImageUrl")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder="https://..."
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                <span className="font-medium text-slate-100">Tags</span>
                <input
                  value={formState.tagsInput}
                  onChange={handleFieldChange("tagsInput")}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                  placeholder="security, roadmap"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="font-medium text-slate-100">Body (Markdown)</span>
              <textarea
                value={formState.contentMarkdown}
                onChange={handleFieldChange("contentMarkdown")}
                className="min-h-[320px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none"
                placeholder={`## Heading\n\nTell your story...`}
                required
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formState.publish}
                  onChange={handlePublishToggle}
                  className="h-4 w-4 rounded border border-white/20 bg-transparent text-teal-500 focus:ring-teal-400"
                />
                <span className="text-sm">Publish on save</span>
              </label>
              <span className="text-xs text-slate-400">
                {formState.publish
                  ? "Post will be live after saving."
                  : "Keep as draft until you're ready."}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedId("new")}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
                disabled={isSaving}
              >
                Reset
              </button>
              <div className="flex items-center gap-3">
                {!isNew ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-full border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-400/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!canSave || isSaving}
                  className="rounded-full border border-teal-400/40 bg-teal-500/10 px-6 py-2 text-sm font-semibold text-teal-100 transition hover:border-teal-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : isNew ? "Create post" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        </article>
      </section>
    </div>
  );
}

function InsightStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ isDraft }: { isDraft: boolean }) {
  return (
    <span
      className={
        isDraft
          ? "inline-flex items-center rounded-full border border-amber-400/50 bg-amber-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100"
          : "inline-flex items-center rounded-full border border-teal-400/50 bg-teal-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-100"
      }
    >
      {isDraft ? "Draft" : "Published"}
    </span>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
      #{label}
    </span>
  );
}

function createEmptyFormState(): FormState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    coverImageUrl: "",
    tagsInput: "",
    contentMarkdown: "",
    publish: false,
  };
}

function mapPostToForm(post: BlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImageUrl ?? "",
    tagsInput: post.tags.join(", "),
    contentMarkdown: post.contentMarkdown,
    publish: !post.isDraft,
  };
}

function buildPayloadFromForm(
  form: FormState,
  existing?: BlogPost,
): BlogPostInput {
  const slug = form.slug.trim();
  const coverImage = form.coverImageUrl.trim();
  const tags = parseTags(form.tagsInput);
  const payload: BlogPostInput = {
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    contentMarkdown: form.contentMarkdown,
    tags,
  };

  if (slug) {
    payload.slug = slug;
  }
  if (coverImage) {
    payload.coverImageUrl = coverImage;
  } else {
    payload.coverImageUrl = null;
  }

  const desiredPublish = form.publish;
  if (!existing) {
    payload.publish = desiredPublish;
  } else {
    const currentlyPublished = !existing.isDraft;
    if (desiredPublish !== currentlyPublished) {
      payload.publish = desiredPublish;
    }
  }

  return payload;
}

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
