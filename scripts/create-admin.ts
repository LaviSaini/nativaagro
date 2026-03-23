/**
 * Create an admin user.
 * Run: npx tsx scripts/create-admin.ts
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local or pass as args.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const email = process.env.ADMIN_EMAIL || process.argv[2];
const password = process.env.ADMIN_PASSWORD || process.argv[3];

async function main() {
  if (!email || !password) {
    console.error("Usage: ADMIN_EMAIL=x ADMIN_PASSWORD=y npx tsx scripts/create-admin.ts");
    console.error("Or: npx tsx scripts/create-admin.ts email@example.com yourpassword");
    process.exit(1);
  }

  const { MongoClient } = await import("mongodb");
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("ecomapp");

  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    await db.collection("users").updateOne(
      { email },
      { $set: { role: "admin", updatedAt: new Date() } }
    );
    console.log(`Updated ${email} to admin`);
  } else {
    await db.collection("users").insertOne({
      email,
      password, // TODO: hash with bcrypt
      name: "Admin",
      role: "admin",
      createdAt: new Date(),
    });
    console.log(`Created admin user: ${email}`);
  }

  await client.close();
}

main().catch(console.error);
