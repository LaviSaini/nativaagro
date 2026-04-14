import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

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
      <main className="bg-white">
        <Container>
          <div className="py-20 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Blog not found
            </h1>
            <div className="mt-6">
              <ButtonLink href="/blogs" variant="outline">
                Back to blogs
              </ButtonLink>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Container>
        <article className="mx-auto max-w-3xl py-12">
          <ButtonLink href="/blogs" variant="ghost" size="sm">
            Back
          </ButtonLink>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {blog.category || "Beekeeping"}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
              {blog.title}
            </h1>
            {(blog.author || blog.publishedAt) && (
              <p className="mt-4 text-sm text-zinc-500">
                {blog.author ? `By ${blog.author}` : ""}
                {blog.author && blog.publishedAt ? " · " : ""}
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ""}
              </p>
            )}
          </div>

          <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="aspect-[16/9] w-full rounded-2xl bg-zinc-100" />
            <div className="mt-8 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
              {blog.content}
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
