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
  const products = [
    {
      name: "Raw Honey 250g",
      description:
        "Bringing pure, unprocessed honey straight from nature to your home, naturally.",
      price: 300,
      stock: 120,
      image: "/products/raw-honey-250g.svg",
      categoryId: catIds[0],
      createdAt: now,
    },
    {
      name: "Raw Honey 500g",
      description:
        "Unfiltered and unprocessed for maximum nutrients—rich, smooth taste.",
      price: 520,
      stock: 80,
      image: "/products/raw-honey-500g.svg",
      categoryId: catIds[0],
      createdAt: now,
    },
    {
      name: "Artisan Mustard Oil",
      description: "Cold-pressed oil with a bold aroma and clean finish.",
      price: 450,
      stock: 60,
      image: "/products/raw-honey-500g.svg",
      categoryId: catIds[1],
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

