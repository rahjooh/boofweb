import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getProducerBlogInsights,
  getProducerBlogPosts,
  isForbiddenError,
  isUnauthorizedError,
} from "@/lib/api-client";
import type { BlogInsightsSummary, BlogPost } from "@/lib/types";
import { ProducerBlogView } from "./producer-blog-view";

export const dynamic = "force-dynamic";

interface ProducerBlogPageProps {
  params: Promise<{ producerId: string }>;
}

export default async function ProducerBlogPage({
  params,
}: ProducerBlogPageProps) {
  const { producerId } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;

  try {
    await getCurrentUser(init);
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      redirect("/login");
    }
    throw error;
  }

  let initialPosts: BlogPost[] = [];
  try {
    initialPosts = await getProducerBlogPosts(producerId, init);
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      redirect("/login");
    }
    throw error;
  }

  let initialInsights: BlogInsightsSummary;
  try {
    initialInsights = await getProducerBlogInsights(producerId, init);
  } catch (error) {
    if (isUnauthorizedError(error) || isForbiddenError(error)) {
      redirect("/login");
    }
    throw error;
  }

  return (
    <ProducerBlogView
      producerId={producerId}
      initialPosts={initialPosts}
      initialInsights={initialInsights}
    />
  );
}
