import { config } from "dotenv";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

config({ path: resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set in .env.local");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri as string);
  await client.connect();
  const db = client.db("ecomapp");

  const now = new Date();

  // Categories
  const categories = [
    { name: "Honey", slug: "honey", icon: "🍯" },
    { name: "Oils", slug: "oils", icon: "🫙" },
    { name: "Nectars", slug: "nectars", icon: "🌿" },
  ];
  await db.collection("categories").deleteMany({ slug: { $in: categories.map((c) => c.slug) } });
  const catResult = await db.collection("categories").insertMany(
    categories.map((c) => ({ ...c, createdAt: now }))
  );
  const catIds = Object.values(catResult.insertedIds).map((id) => id.toString());

  // Products
  const honeyHighlights = [
    "100% pure & natural",
    "Unfiltered for maximum nutrients",
    "Sourced from trusted beekeepers",
    "No added sugar or artificial flavours",
  ];

  const honeyFaqs = [
    {
      question: "What is raw honey?",
      answer:
        "Raw honey is collected and packed with minimal processing so it keeps natural enzymes, aroma, and texture.",
    },
    {
      question: "Why does my honey crystallize?",
      answer:
        "Crystallization is natural for raw honey. Gently warm the jar in water to reliquefy—do not boil.",
    },
    {
      question: "How should I store it?",
      answer: "Store at room temperature in a dry place. A tight lid keeps moisture out.",
    },
  ];

  const products = [
    {
      name: "Raw Honey 250g",
      description:
        "Bringing pure, unprocessed honey straight from nature to your home, naturally.",
      price: 300,
      stock: 120,
      images: ["/products/raw-honey-250g.svg"],
      image: "/products/raw-honey-250g.svg",
      categoryId: catIds[0],
      packSize: "250g jar",
      promoLine: "Small jar — perfect to try our hive-to-home flavour.",
      highlights: honeyHighlights,
      faqs: honeyFaqs,
      createdAt: now,
    },
    {
      name: "Raw Honey 500g",
      description:
        "Unfiltered and unprocessed for maximum nutrients—rich, smooth taste.",
      price: 520,
      stock: 80,
      images: ["/products/raw-honey-500g.svg", "/products/raw-honey-250g.svg"],
      image: "/products/raw-honey-500g.svg",
      categoryId: catIds[0],
      packSize: "500g jar",
      promoLine: "Best value for families — same purity, more golden goodness.",
      highlights: honeyHighlights,
      faqs: honeyFaqs,
      createdAt: now,
    },
    {
      name: "Clover Blossom Honey 400g",
      description:
        "Light, floral notes from spring clover—lovely in tea, on toast, or by the spoonful.",
      price: 420,
      stock: 95,
      images: ["/products/raw-honey-250g.svg", "/products/raw-honey-500g.svg"],
      image: "/products/raw-honey-250g.svg",
      categoryId: catIds[0],
      packSize: "400g jar",
      promoLine: "Floral clover profile — delicate sweetness for everyday rituals.",
      highlights: [
        "Single-origin clover nectar",
        "Smooth, spreadable texture",
        "Ideal for tea and baking",
        "Lab-tested for purity",
      ],
      faqs: honeyFaqs,
      createdAt: now,
    },
    {
      name: "Artisan Mustard Oil",
      description: "Cold-pressed oil with a bold aroma and clean finish.",
      price: 450,
      stock: 60,
      images: ["/products/raw-honey-500g.svg"],
      image: "/products/raw-honey-500g.svg",
      categoryId: catIds[1],
      packSize: "500 ml bottle",
      promoLine: "Cold-pressed in small batches — bold aroma for Indian cooking.",
      highlights: [
        "Cold-pressed extraction",
        "No chemical refining",
        "High smoke point for sautéing",
        "Glass bottle friendly",
      ],
      faqs: [
        {
          question: "Is this oil filtered?",
          answer: "We use minimal mechanical filtration to keep natural flavour and nutrients.",
        },
        {
          question: "How do I store mustard oil?",
          answer: "Keep in a cool, dark place. Refrigeration is optional and may cause slight clouding.",
        },
      ],
      createdAt: now,
    },
  ];
  await db.collection("products").deleteMany({ name: { $in: products.map((p) => p.name) } });
  await db.collection("products").insertMany(products);

  // Blogs
  const blogs = [
    {
      title: "Our Eco-Friendly Beekeeping Sustainability Practices",
      excerpt: "Nestled in pristine landscapes, our apiary is a haven for honeybees.",
      category: "Beekeeping",
      coverImage: "/blogs/eco-friendly-beekeeping.svg",
      author: "Nativa Agro",
      publishedAt: new Date("2024-01-05T00:00:00.000Z"),
      content:
        "Sustainability Practices\n\nWe work with trusted beekeepers and prioritize minimal interference harvesting to preserve nutrients and flavor.\n\n- No excessive heating\n- No additives\n- Transparent sourcing\n",
      createdAt: now,
    },
    {
      title: "How to Store Raw Honey (and Why It Crystallizes)",
      excerpt: "Crystallization is natural—here’s how to store honey properly.",
      category: "Beekeeping",
      coverImage: "/blogs/eco-friendly-beekeeping.svg",
      author: "Nativa Agro",
      publishedAt: new Date("2024-02-10T00:00:00.000Z"),
      content:
        "Raw honey can crystallize over time. This is normal.\n\nStore it at room temperature and avoid refrigeration.\n",
      createdAt: now,
    },
    {
      title: "Why Raw Honey Tastes Different Every Season",
      excerpt: "Nectar flows and weather shape each harvest—here is what changes in the jar.",
      category: "Beekeeping",
      coverImage: "/blogs/eco-friendly-beekeeping.svg",
      author: "Nativa Agro",
      publishedAt: new Date("2024-03-18T00:00:00.000Z"),
      content:
        "Honey reflects the plants bees forage on. Spring clover, summer wildflowers, and autumn blooms each leave a distinct fingerprint on aroma and finish.\n",
      createdAt: now,
    },
  ];
  await db.collection("blogs").deleteMany({ title: { $in: blogs.map((b) => b.title) } });
  await db.collection("blogs").insertMany(blogs);

  // Reviews
  const reviews = [
    {
      name: "Umar V",
      rating: 4,
      text:
        "After frequent use every morning I feel more relaxed and anxious free. After dabbling with honey products, I didn’t expect to find one that actually feels this pure.",
      createdAt: now,
    },
    {
      name: "Aisha K",
      rating: 5,
      text:
        "The flavor is rich and smooth and the jar feels premium. I love how transparent the sourcing feels.",
      createdAt: now,
    },
    {
      name: "Rahul S",
      rating: 4,
      text:
        "Crystallization happened naturally after some time which reassured me it’s real raw honey. Highly recommended.",
      createdAt: now,
    },
  ];
  await db.collection("reviews").deleteMany({ name: { $in: reviews.map((r) => r.name) } });
  await db.collection("reviews").insertMany(reviews);

  // Users
  const users = [
    { name: "Test User", email: "test@nativaagro.com", password: "Password123", role: "user" },
    { name: "Demo User", email: "demo@nativaagro.com", password: "Password123", role: "user" },
    {
      name: "Admin User",
      email: "admin@nativaagro.com",
      password: "Password123",
      role: "admin",
    },
  ];
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await db.collection("users").updateOne(
      { email: u.email },
      {
        $set: {
          name: u.name,
          email: u.email,
          role: u.role,
          passwordHash,
          disabled: false,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  // Default settings (optional keys for storefront)
  await db.collection("settings").updateOne(
    { key: "shippingMethodsJson" },
    {
      $set: {
        key: "shippingMethodsJson",
        value: JSON.stringify([
          { id: "standard", label: "Standard", price: 0, days: "5–7" },
          { id: "express", label: "Express", price: 99, days: "2–3" },
        ]),
        updatedAt: now,
      },
    },
    { upsert: true }
  );
  await db.collection("settings").updateOne(
    { key: "couponsJson" },
    {
      $set: {
        key: "couponsJson",
        value: JSON.stringify([{ code: "WELCOME10", percentOff: 10, active: true }]),
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  console.log("Seeded demo data:");
  console.log("- categories:", categories.length);
  console.log("- products:", products.length);
  console.log("- blogs:", blogs.length);
  console.log("- reviews:", reviews.length);
  console.log(
    "- users: 3 (test@ / demo@ / admin@nativaagro.com — all Password123; admin has role admin)"
  );

  await client.close();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

