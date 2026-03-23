import Link from "next/link";

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
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Blog</h1>
        {blogs.length === 0 ? (
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            No blog posts yet. Add MONGODB_URI to .env.local and seed your
            database to see blogs here.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map(
              (blog: {
                _id: string;
                title: string;
                excerpt?: string;
                author?: string;
                publishedAt?: string;
              }) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h2 className="font-semibold text-zinc-900">{blog.title}</h2>
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  {blog.author && (
                    <p className="mt-4 text-xs text-zinc-500">
                      By {blog.author}
                      {blog.publishedAt && (
                        <> · {new Date(blog.publishedAt).toLocaleDateString()}</>
                      )}
                    </p>
                  )}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
