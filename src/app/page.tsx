import { cookies } from "next/headers";
import { BlogSpotlight } from "@/components/home/blog-spotlight";
import { FeatureHighlights } from "@/components/home/feature-highlights";
import { HeroSection } from "@/components/home/hero-section";
import { JourneySection } from "@/components/home/journey-section";
import { MembershipBanner } from "@/components/home/membership-banner";
import { ProductShowcase } from "@/components/home/product-showcase";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { getProducts, getStorefrontBlogPosts } from "@/lib/api-client";
import { getDefaultProducerId } from "@/lib/env";
import { logger } from "@/lib/logger";

export default async function Home() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const init = cookieHeader ? { headers: { cookie: cookieHeader } } : undefined;
  const producerId = getDefaultProducerId();
  const homeLogger = logger.child({ scope: "home" });

  const [productsResult, blogPostsResult] = await Promise.allSettled([
    getProducts(init),
    getStorefrontBlogPosts(producerId, init),
  ]);

  let products: Awaited<ReturnType<typeof getProducts>> = [];
  if (productsResult.status === "fulfilled") {
    products = productsResult.value
      .filter((product) => product.status !== "archived")
      .slice(0, 6);
  } else {
    homeLogger.warn("Failed to load products for homepage", {
      error: productsResult.reason,
    });
  }

  let posts: Awaited<ReturnType<typeof getStorefrontBlogPosts>> = [];
  if (blogPostsResult.status === "fulfilled") {
    posts = blogPostsResult.value.filter((post) => !post.isDraft).slice(0, 3);
  } else {
    homeLogger.warn("Failed to load blog posts for homepage", {
      error: blogPostsResult.reason,
    });
  }

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      <HeroSection producerId={producerId} />
      <FeatureHighlights />
      <ProductShowcase products={products} />
      <JourneySection />
      <MembershipBanner producerId={producerId} />
      <TestimonialsSection />
      <BlogSpotlight posts={posts} producerId={producerId} />
    </div>
  );
}
