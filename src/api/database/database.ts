// pnpm i --filter=api mysql2

import type { Pool } from "mysql2/promise";
import { createPool } from "mysql2/promise";

let connectionPool: Pool;

export function getConnection(): Pool {
    if (!connectionPool) {
        connectionPool = createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT as string),
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT as string),
        });
    }

    return connectionPool;
}

export async function queryDatabase<T = any>(query: string, ...values: any[]): Promise<T> {
    const queryResult: any = await getConnection().execute(query, values);
    return queryResult[0] as T;
}
