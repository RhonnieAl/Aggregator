// Handle Connection to MongoDB with this file using the native MongoDB driver (MongoClient)
// I removed Mongoose because of conflict with next-auth that uses the driver and not mongoose
// it would have meant maintaining 2 open connections to the db at all times (with MongoClient and Mongoose)

// libs/mongo.ts
import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your environment"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable in your environment"
  );
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { client: null, db: null, promise: null };
}

export async function dbConnect(): Promise<Db> {
  if (cached.db) {
    return cached.db;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log("Connected to MongoDB");
      return client;
    })();
  }

  try {
    cached.client = await cached.promise;
    cached.db = cached.client.db(MONGODB_DB);
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.db;
}

export const getClient = async (): Promise<MongoClient> => {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log("Connected to MongoDB");
      return client;
    })();
  }

  try {
    cached.client = await cached.promise;
    cached.db = cached.client.db(MONGODB_DB);
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
};
