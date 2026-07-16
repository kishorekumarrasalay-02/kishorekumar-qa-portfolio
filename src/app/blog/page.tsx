import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Short QA notes — API testing with Postman, Playwright automation, and the path to SDET.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-3 text-muted">
          Short write-ups on testing craft and my SDET learning path.
        </p>

        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="rounded-2xl border border-card-border bg-card p-5 transition hover:border-primary/40"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{post.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <time dateTime={post.date}>{post.date}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime}</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-primary-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
