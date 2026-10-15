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

const mongoDb = mongoClient.db(process.env.MONGO_DB_NAME || "bazar-dor-auth");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const authSecret = process.env.BETTER_AUTH_SECRET;
const deploymentHost = process.env.VERCEL_URL;
const authBaseURL =
  process.env.BETTER_AUTH_URL ||
  (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000");

if (process.env.NODE_ENV === "production" && !authSecret) {
  throw new Error("BETTER_AUTH_SECRET must be configured in production");
}

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb),
  secret: authSecret || "bazar-dor-local-development-secret-please-replace",
  baseURL: authBaseURL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
    ...(githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        }
      : {}),
  },
});
