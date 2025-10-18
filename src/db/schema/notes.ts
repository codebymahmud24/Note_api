import { pgTable, serial, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),

  pinned: boolean("pinned").default(false).notNull(),
  archived: boolean("archived").default(false).notNull(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations
export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));
