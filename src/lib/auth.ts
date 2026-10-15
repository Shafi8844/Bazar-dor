import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUrl = process.env.MONGO_DB_URL;

if (!mongoUrl) {
  throw new Error("MONGO_DB_URL is not configured");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const mongoClient = globalForMongo.mongoClient ?? new MongoClient(mongoUrl);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

const mongoDb = mongoClient.db(process.env.MONGO_DB_NAME || "bazar-dor");

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar-dor-local-development-secret-please-replace",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "demo-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "demo-github-client-secret",
    },
  },
});
