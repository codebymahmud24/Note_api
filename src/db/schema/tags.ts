// db/schema/tags.ts
import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { notes } from './notes';
import { relations } from 'drizzle-orm';

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const noteTags = pgTable('note_tags', {
  id: serial('id').primaryKey(),
  noteId: integer('note_id')
    .notNull()
    .references(() => notes.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
});

// Relations
export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  tag: one(tags, {
    fields: [noteTags.tagId],
    references: [tags.id],
  }),

  note: one(notes, {
    fields: [noteTags.noteId],
    references: [notes.id],
  }),
}));
