import type { Pool } from "mysql2/promise";
import { createPool } from "mysql2/promise";
import { UserData } from "@shared/types/UserData";

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
    const [results] = await getConnection().execute(query, values);
    return results as T;
}

export async function getUserById(userId: number): Promise<UserData | null> {
    const results: UserData[] = await queryDatabase<UserData[]>(
        "SELECT id, email, name, password FROM users WHERE id = ?",
        userId
    );

    if (results.length > 0) {
        return results[0];
    }

    return null;
}
