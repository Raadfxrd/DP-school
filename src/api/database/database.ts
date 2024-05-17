// pnpm i --filter=api mysql2

import type { Pool } from "mysql2/promise";
import { createPool } from "mysql2/promise";

let connectionPool: Pool;

export function getConnection(): Pool {
    if (!connectionPool) {
        connectionPool = createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
        });
    }

    return connectionPool;
}

export async function queryDatabase<T = any>(query: string, values: any[]): Promise<T> {
    const [rows] = await getConnection().execute(query, values);
    return rows as T;
}
