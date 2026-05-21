import { getDb } from "./db.middleware";

export type DbType = ReturnType<typeof getDb>;
