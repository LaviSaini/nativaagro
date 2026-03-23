import Link from "next/link";

async function getBlog(id: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/blogs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Blog not found</h1>
          <Link
            href="/blogs"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/blogs"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to blog
        </Link>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">{blog.title}</h1>
          {(blog.author || blog.publishedAt) && (
            <p className="mt-4 text-sm text-zinc-500">
              {blog.author && <>By {blog.author}</>}
              {blog.author && blog.publishedAt && " · "}
              {blog.publishedAt && (
                <> {new Date(blog.publishedAt).toLocaleDateString()}</>
              )}
            </p>
          )}
        </header>
        <div className="prose prose-zinc max-w-none rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="whitespace-pre-wrap text-zinc-700">
            {blog.content}
          </div>
        </div>
      </article>
    </div>
  );
}
