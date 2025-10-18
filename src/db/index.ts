import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as notesSchema from "./schema/notes";
import * as usersSchema from "./schema/users";
import * as tagsSchema from "./schema/tags";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Combine all schemas into one object
const schema = {
  ...notesSchema,
  ...usersSchema,
  ...tagsSchema
};

export const db = drizzle(pool, { schema });