export default function AboutPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
              Our Story
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              As honey became widely commercialized, many products lost their natural
              essence through excessive processing. In this changing landscape, true
              purity and trust became increasingly rare.
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Nativa Agro exists to bring authentic, minimally processed honey to your
              home—sourced responsibly, handled carefully, and delivered with
              transparency.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900">
                Mission
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Provide pure, unprocessed honey sourced directly from nature while
                encouraging healthier everyday choices.
              </p>
              <div className="my-6 h-px bg-zinc-200" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900">
                Vision
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Help people live healthier and happier lives by embracing natural
                products and building sustainable habits around purity and wellness.
              </p>
              <div className="my-6 h-px bg-zinc-200" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900">
                Values
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>
                  <span className="font-medium text-zinc-900">Transparency</span> — open and
                  honest, always.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">People-first</span> — trust and
                  care at the center.
                </li>
                <li>
                  <span className="font-medium text-zinc-900">Curiosity</span> — keep learning
                  and improving.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            What Makes Us Different
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Pure honey sourced naturally, with no additives or artificial processing.",
              "Carefully tested and quality-checked for authenticity and consistency.",
              "Direct sourcing from trusted beekeepers for transparency and purity.",
              "More than just honey — we promote natural living and everyday wellness.",
              "Sustainably sourced with respect for bees, nature, and the environment.",
            ].map((t,key) => (
              <div key={key} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <p className="text-sm leading-6 text-zinc-600">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Meet the Team
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { name: "Anuj Tiwari", bio: "Founder & beekeeper. Building purity-first products with care." },
              { name: "Team Member", bio: "Operations & sourcing. Working with trusted local partners." },
              { name: "Team Member", bio: "Customer experience. Helping you choose the right product." },
            ].map((p,key) => (
              <div key={key} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <p className="font-medium text-zinc-900">{p.name}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{p.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

