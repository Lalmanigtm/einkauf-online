import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// import all the code of schema to here to use
import * as schema from "./schema";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
