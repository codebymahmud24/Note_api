import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { db } from '../db';
import { notes } from '../db/schema/notes';
import { eq, and, ilike, count, desc  } from 'drizzle-orm';
import { noteTags, tags } from '../db/schema/tags'; // ✅ import these

@Injectable()
export class NotesService {
  constructor(@Inject('DATABASE') private database: typeof db) {}

  async create(userId: number, title: string, content: string) {
    const [note] = await this.database
      .insert(notes)
      .values({ title, content, userId })
      .returning();
    return note;
  }

  async findAll(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Fetch paginated and ordered notes
    const userNotes = await this.database
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.pinned), desc(notes.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination metadata
    const [{ value }] = await this.database
      .select({ value: count() })
      .from(notes)
      .where(eq(notes.userId, userId));

    const totalCount = Number(value);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      notes: userNotes,
    };
  }

  async findOne(userId: number, noteId: number) {
    const [note] = await this.database
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));

    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(
    userId: number,
    noteId: number,
    data: Partial<{ title: string; content: string }>,
  ) {
    // first validate
    const user = await this.findOne(userId, noteId);
    
    if (!user) throw new NotFoundException('Note not found');
    
    const [note] = await this.database
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning();

    if (!note) throw new ForbiddenException("You can't edit this note");
    return note;
  }

  async remove(userId: number, noteId: number) {
    const [deleted] = await this.database
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning();

    if (!deleted) throw new ForbiddenException("You can't delete this note");
    return deleted;
  }

  // In your service
  async search(userId: number, search: string) {
    const cleanSearch = search ? search.replace(/^["']|["']$/g, '').trim() : '';

    const result = await this.database
      .select()
      .from(notes)
      .where(and(eq(notes.userId, userId), ilike(notes.title, `%${cleanSearch}%`)));

    return result;
  }

  async togglePin(userId: number, noteId: number) {
    const note = await this.findOne(userId, noteId);
    const [updated] = await this.database
      .update(notes)
      .set({ pinned: !note.pinned, updatedAt: new Date() })
      .where(eq(notes.id, noteId))
      .returning();
    return updated;
  }

  async toggleArchive(userId: number, noteId: number) {
    const note = await this.findOne(userId, noteId);
    const [updated] = await this.database
      .update(notes)
      .set({ archived: !note.archived, updatedAt: new Date() })
      .where(eq(notes.id, noteId))
      .returning();
    return updated;
  }

   // 🔍 Find notes by a specific tag
  async findByTag(userId: number, tagId: number) {
    // First, ensure the tag exists
    const [tag] = await this.database.select().from(tags).where(eq(tags.id, tagId));
    if (!tag) throw new NotFoundException('Tag not found');

    // Join notes with note_tags to get notes that belong to this tag
    const notesWithTag = await this.database
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        pinned: notes.pinned,
        archived: notes.archived,
        // createdAt: notes.createdAt,
        // updatedAt: notes.updatedAt,
      })
      .from(notes)
      .innerJoin(noteTags, eq(notes.id, noteTags.noteId))
      .where(
        and(eq(noteTags.tagId, tagId), eq(notes.userId, userId))
      )
      .orderBy(desc(notes.pinned), desc(notes.createdAt));

    return {
      tag,
      count: notesWithTag.length,
      notes: notesWithTag,
    };
  }
}
