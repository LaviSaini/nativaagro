/**
 * Seed script for categories.
 * Run: npm run seed:categories
 *
 * Categories schema: { name, slug, icon? }
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const CATEGORIES = [
  { name: "Fashion", slug: "fashion", icon: "👕" },
  { name: "Mobiles", slug: "mobiles", icon: "📱" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Electronics", slug: "electronics", icon: "💻" },
  { name: "Home", slug: "home", icon: "🏠" },
  { name: "Appliances", slug: "appliances", icon: "📺" },
  { name: "Toys", slug: "toys", icon: "🧸" },
  { name: "Food", slug: "food", icon: "🫙" },
  { name: "Auto", slug: "auto", icon: "🚗" },
  { name: "Sports", slug: "sports", icon: "⚾" },
  { name: "Books", slug: "books", icon: "📚" },
  { name: "Furniture", slug: "furniture", icon: "🛋️" },
];

async function seed() {
  const { MongoClient } = await import("mongodb");
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("ecomapp");
  const result = await db.collection("categories").insertMany(CATEGORIES);
  console.log(`Inserted ${result.insertedCount} categories`);
  await client.close();
}

seed().catch(console.error);
