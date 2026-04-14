import Link from "next/link";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="bg-white">
      <Container>
        <div className="py-20 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            404
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
            Page not found
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            The page you’re looking for doesn’t exist or has moved.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <ButtonLink href="/" variant="outline">
              Go home
            </ButtonLink>
            <Link
              href="/products"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Shop products
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

