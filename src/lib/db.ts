import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error(
      "Please add MONGODB_URI to your .env.local. Get your connection string from MongoDB Atlas."
    );
  }

  if (db) {
    return db;
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db("ecomapp");

  return db;
}

export function getDb(): Db | null {
  return db;
}
