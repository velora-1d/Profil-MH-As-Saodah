import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";

const pool = new Pool({
  connectionString,
  max: 10,
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
export { schema };
