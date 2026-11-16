import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Same precedence as Next.js: .env.local wins over .env.
config({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: "./src/db/tables.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
