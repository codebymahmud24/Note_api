import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { db } from '../db';
import { tags, noteTags } from '../db/schema/tags';
import { notes } from '../db/schema/notes';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class TagsService {
  constructor() {}

  // Create a new tag
  async createTag(name: string) {
    const normalizedName = name.trim().toLowerCase();

    const existing = await db
      .select()
      .from(tags)
      .where(eq(tags.name, normalizedName));

    if (existing.length) throw new ConflictException('Tag already exists');

    const [tag] = await db
      .insert(tags)
      .values({ name: normalizedName })
      .returning();
    return tag;
  }

  // Get all tags
  async findAll() {
    return await db.select().from(tags);
  }

  // Get tag by ID
  async findOne(id: number) {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  // Delete tag
  async remove(id: number) {
    const [deleted] = await db.delete(tags).where(eq(tags.id, id)).returning();
    if (!deleted) throw new NotFoundException('Tag not found');
    return deleted;
  }

  // Assign a tag to a note
  async assignTag(noteId: number, tagId: number) {

    // Ensure both IDs are numbers
    if (typeof noteId !== 'number' || typeof tagId !== 'number')
      throw new NotFoundException('Invalid ID');
    
    // Ensure note & tag exist
    const [note] = await db.select().from(notes).where(eq(notes.id, noteId));
    const [tag] = await db.select().from(tags).where(eq(tags.id, tagId));

    if (!note) throw new NotFoundException('Note not found');
    if (!tag) throw new NotFoundException('Tag not found');

    // Prevent duplicates
    const existing = await db
      .select()
      .from(noteTags)
      .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagId)));

    if (existing.length) throw new ConflictException('Tag already assigned');

    const [linked] = await db
      .insert(noteTags)
      .values({ noteId, tagId })
      .returning();
    return linked;
  }

  // Remove a tag from a note
  async unassignTag(noteId: number, tagId: number) {
    const [deleted] = await db
      .delete(noteTags)
      .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagId)))
      .returning();

    if (!deleted) throw new NotFoundException('Tag not assigned to this note');
    return deleted;
  }

  // Get all tags for a specific note
  async getTagsForNote(noteId: number) {
    const result = await db
      .select({
        tagId: tags.id,
        tagName: tags.name,
      })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(noteTags.noteId, noteId));

    return result;
  }
}
