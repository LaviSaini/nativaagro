import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";

async function getBlogs() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            Stories from Nature
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Our Blogs
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            {blogs.length} Blogs
          </p>

          {blogs.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
              No blog posts yet.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map(
                (blog: {
                  _id: string;
                  title: string;
                  excerpt?: string;
                  author?: string;
                  publishedAt?: string;
                  category?: string;
                  coverImage?: string;
                }) => (
                  <Link
                    key={blog._id}
                    href={`/blogs/${blog._id}`}
                    className="rounded-3xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
                      <Image
                        src={blog.coverImage || "/blogs/eco-friendly-beekeeping.svg"}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {blog.category || "Beekeeping"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                      {blog.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                      {blog.excerpt}
                    </p>
                    <p className="mt-4 text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4">
                      Read full post
                    </p>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
