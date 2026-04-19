import Image from "next/image";
import Image1 from "../../../public/products/OS1.jpg";
import Image2 from "../../../public/products/OS2.jpg";
import Image3 from "../../../public/products/OS3.png";
import Hands from "../../../public/products/Hand.png";
import Icon1 from "../../../public/products/Icon1.png";
import Icon2 from "../../../public/products/Icon2.png";
import Icon3 from "../../../public/products/Icon3.png";
import Icon4 from "../../../public/products/Icon4.png";
import Icon5 from "../../../public/products/Icon5.png";
import Coming from "@/components/products/Coming";


export default function AboutPage() {
  return (
    <main className="bg-white">
      <div >
        <div className=" bg-[#5f7268] px-6 py-12 md:px-12 md:py-16 text-white">

          {/* TOP ROW */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <h1 className="text-4xl font-semibold tracking-tight">
              Our Story
            </h1>

            <p className="text-sm leading-6 text-white/80 md:pl-10">
              As honey became widely commercialized, many products lost their
              natural essence through excessive processing. In this changing
              landscape, true purity and trust became increasingly rare.
            </p>
          </div>

          {/* DIVIDER */}
          <div className="mt-8 h-px w-full bg-white/20" />

          {/* VALUES GRID (3 columns like design) */}
          <div className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-3 text-sm">

            <div>
              <p className="font-semibold tracking-widest">MISSION</p>
              <p className="mt-3 text-white/70 leading-6">
                Our mission is to provide pure, unprocessed honey sourced directly
                from nature while encouraging healthier everyday choices.
              </p>
            </div>

            <div>
              <p className="font-semibold tracking-widest">VISION</p>
              <p className="mt-3 text-white/70 leading-6">
                To help people live healthier and happier lives by embracing
                natural products and building sustainable habits around purity
                and wellness.
              </p>
            </div>

            <div>
              <p className="font-semibold tracking-widest">VALUES</p>
              <p className="mt-3 text-white/70 leading-6">
                People-first approach. Placing the needs and trust of our
                customers at the center of everything we do.
              </p>
            </div>

            <div>
              <p className="font-semibold tracking-widest">TRANSPARENCY</p>
              <p className="mt-3 text-white/70 leading-6">
                Committed to openness and honesty, ensuring you always receive
                pure honey exactly as promised.
              </p>
            </div>

            <div>
              <p className="font-semibold tracking-widest">CURIOSITY</p>
              <p className="mt-3 text-white/70 leading-6">
                Driven by curiosity and learning, we continue to improve and
                innovate for better quality and customer experience.
              </p>
            </div>

          </div>

          {/* IMAGE GRID (matches screenshot layout) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* LEFT STACK */}
            <div className="flex flex-col gap-4">

              <div className="relative h-[220px] rounded-xl overflow-hidden">
                <Image
                  src={Image1}
                  alt="Honey"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative h-[120px] rounded-xl overflow-hidden">
                <Image
                  src={Image2}
                  alt="Bee"
                  fill
                  className="object-cover"
                />
              </div>

            </div>

            {/* RIGHT BIG IMAGE */}
            <div className="relative md:col-span-2 h-[360px] rounded-xl overflow-hidden">
              <Image
                src={Image3}
                alt="Beekeeper"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
        <section className="mt-20 ">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
            What Makes Us Different
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT IMAGE */}
            <div className="flex justify-center md:justify-start">
              <Image
                src={Hands}
                alt="Dropper"
                className="max-w-md w-full object-contain"
              />
            </div>

            {/* RIGHT GRID */}
            <div className="relative grid grid-cols-2">

              {/* CENTER VERTICAL LINE */}
              <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-300 -translate-x-1/2" />

              {/* LEFT COLUMN */}
              <div className="flex flex-col">

                {/* ITEM 1 */}
                <div className="flex flex-col items-center text-center px-8 py-10 border-b border-zinc-200">
                  <div className="mb-3 relative w-6 h-6">
                    <Image src={Icon3} alt="icon1" fill className="object-contain" />
                  </div>
                  <p className="text-[13px] leading-5 text-zinc-600 max-w-[180px]">
                    Pure honey sourced naturally, with no additives or artificial processing.
                  </p>
                </div>

                {/* ITEM 3 */}
                <div className="flex flex-col items-center text-center px-8 py-10 border-b border-zinc-200">
                  <div className="mb-3 relative w-6 h-6">
                    <Image src={Icon2} alt="icon3" fill className="object-contain" />
                  </div>
                  <p className="text-[13px] leading-5 text-zinc-600 max-w-[180px]">
                    Direct sourcing from trusted beekeepers for better transparency and purity.
                  </p>
                </div>

                {/* ITEM 5 */}
                <div className="flex flex-col items-center text-center px-8 py-10">
                  <div className="mb-3 relative w-6 h-6">
                    <Image src={Icon1} alt="icon5" fill className="object-contain" />
                  </div>
                  <p className="text-[13px] leading-5 text-zinc-600 max-w-[200px]">
                    Sustainably sourced with respect for bees, nature, and the environment.
                  </p>
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col">

                {/* ITEM 2 */}
                <div className="flex flex-col items-center text-center px-8 py-10 border-b border-zinc-200">
                  <div className="mb-3 relative w-6 h-6">
                    <Image src={Icon4} alt="icon2" fill className="object-contain" />
                  </div>
                  <p className="text-[13px] leading-5 text-zinc-600 max-w-[180px]">
                    Carefully tested and quality-checked to ensure authenticity and consistency.
                  </p>
                </div>

                {/* ITEM 4 */}
                <div className="flex flex-col items-center text-center px-8 py-10 border-b border-zinc-200">
                  <div className="mb-3 relative w-6 h-6">
                    <Image src={Icon5} alt="icon4" fill className="object-contain" />
                  </div>
                  <p className="text-[13px] leading-5 text-zinc-600 max-w-[180px]">
                    More than just honey — we promote natural living and everyday wellness.
                  </p>
                </div>

                {/* EMPTY SPACE */}
                <div className="py-10" />

              </div>

            </div>
          </div>
        </section>
        <Coming heading="Upcoming Products" />

        <section className="mt-14 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Meet the Team
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { name: "Anuj Tiwari", bio: "Founder & beekeeper. Building purity-first products with care." },
              { name: "Team Member", bio: "Operations & sourcing. Working with trusted local partners." },
              { name: "Team Member", bio: "Customer experience. Helping you choose the right product." },
            ].map((p) => (
              <div key={p.name} className="rounded-2xl border border-zinc-200 bg-white p-6">
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

