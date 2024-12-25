import { relations } from "drizzle-orm";
import { primaryKey, sqliteTable as table } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "./utils";

export const Post = table("post", (t) => ({
  id: t
    .text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: t.text("title").notNull(),
  content: t.text("content").notNull(),
  ...timestamps,
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const User = table("user", (t) => ({
  id: t
    .text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text("name"),
  email: t.text("email").notNull(),
  emailVerified: t.integer("email_verified", { mode: "timestamp" }),
  image: t.text("image"),
}));

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = table(
  "account",
  (t) => ({
    userId: t
      .text("user_id")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: t
      .text("type")
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: t.text("provider").notNull(),
    providerAccountId: t.text("provider_account_id").notNull(),
    refresh_token: t.text("refresh_token"),
    access_token: t.text("access_token"),
    expires_at: t.integer("expires_at"),
    token_type: t.text("token_type"),
    scope: t.text("scope"),
    id_token: t.text("id_token"),
    session_state: t.text("session_state"),
  }),
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = table("session", (t) => ({
  sessionToken: t.text("session_token").notNull().primaryKey(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: t.integer("expires", { mode: "timestamp" }).notNull(),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
