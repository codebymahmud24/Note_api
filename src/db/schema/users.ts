import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { Role } from 'src/common/enum/role.enum';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).default(Role.USER).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
