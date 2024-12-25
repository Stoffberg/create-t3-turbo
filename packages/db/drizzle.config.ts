import type { Config } from "drizzle-kit";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing TURSO_DATABASE_URL");
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Missing TURSO_AUTH_TOKEN");
}

export default {
  schema: "./src/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  casing: "snake_case",
} satisfies Config;
