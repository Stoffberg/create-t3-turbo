import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing TURSO_DATABASE_URL");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Missing TURSO_AUTH_TOKEN");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle({
  client,
  schema,
  casing: "snake_case",
});
