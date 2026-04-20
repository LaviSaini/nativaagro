import Container from "@/components/ui/Container";

type Props = {
  /** Use inside admin main or other inset layouts (no outer `<main>`). */
  embedded?: boolean;
};

export default function PageSkeleton({ embedded }: Props) {
  const body = (
    <Container>
      <div className="py-10 sm:py-12">
        <div className="h-9 w-56 max-w-[85%] animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-4 max-w-2xl space-y-2.5">
          <div className="h-3.5 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-3.5 w-[92%] animate-pulse rounded bg-zinc-100" />
          <div className="h-3.5 w-[70%] animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4"
            >
              <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-zinc-200" />
              <div className="mt-4 h-4 w-[80%] max-w-[200px] animate-pulse rounded bg-zinc-200" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-zinc-200" />
              <div className="mt-4 h-8 w-full animate-pulse rounded-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );

  if (embedded) {
    return (
      <div className="min-h-[50vh]" role="status" aria-busy="true" aria-live="polite">
        {body}
      </div>
    );
  }

  return (
    <main
      className="min-h-[calc(100vh-72px)] bg-white"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {body}
    </main>
  );
}
