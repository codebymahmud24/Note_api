import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;


// // This is for generating the schema and pushing to database
// npx drizzle-kit generate --config=src/db/drizzle.config.ts
// npx drizzle-kit push --config=src/db/drizzle.config.ts

// // This is for Showing the database in a GUI
// npx drizzle-kit studio
