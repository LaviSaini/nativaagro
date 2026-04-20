import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";

export type HomeBlogPost = {
  _id: string;
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string | Date;
  coverImage?: string;
};

const DEFAULT_COVER = "/blogs/eco-friendly-beekeeping.svg";

function formatBlogDate(publishedAt?: string | Date) {
  if (!publishedAt) {
    return "";
  }
  const d = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Blogs({ posts }: { posts: HomeBlogPost[] }) {
  return (
    <section className="border-t border-zinc-200/80 bg-white">
      <Container>
        <div className="py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
                Featured Blogs
              </h2>
              <p className="mt-3 max-w-xxl text-base text-[color:var(--text)]">
                Stories from nature—your go-to resource for wellness wisdom and industry updates.
              </p>
            </div>

            <Link
              href="/blogs"
              className="inline-flex min-h-[44px] items-center rounded-md bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2)] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:brightness-[0.98]"
            >
              View all
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
              No blog posts yet. Check back soon!
            </div>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {posts.map((blog) => (
                <Link key={blog._id} href={`/blogs/${blog._id}`} className="group flex flex-col">
                  <div className="relative aspect-[385/271] w-full overflow-hidden rounded-[20px]">
                    <Image
                      src={blog.coverImage || DEFAULT_COVER}
                      alt={blog.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="33vw"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-[#F4A940] px-4 py-1 text-xs font-medium text-black">
                      {blog.category || "Beekeeping"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="text-sm text-[#7A7A7A]">{formatBlogDate(blog.publishedAt) || "—"}</p>

                    <h3 className="mt-2 text-[18px] font-semibold leading-snug text-[#1F1F1F]">{blog.title}</h3>

                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-[#6B6B6B]">
                      {blog.excerpt || "Read the full story on our blog."}
                    </p>

                    <span className="mt-4 text-sm font-medium text-[#201914] underline decoration-[#FFB64C] underline-offset-4">
                      Read full post
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
