import { UserData } from "@shared/types";
import { Pool } from "mysql2/promise";
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
            charset: "utf8mb4",
        });
    }
    return connectionPool;
}

export async function queryDatabase<T = any>(query: string, ...values: any[]): Promise<T> {
    try {
        const [results] = await getConnection().execute(query, values);
        return results as T;
    } catch (error: any) {
        console.error("Query Database Error:", error.message);
        throw error;
    }
}

export async function getUserById(userId: number): Promise<UserData | null> {
    const results: UserData[] = await queryDatabase<UserData[]>(
        "SELECT id, email, username, password FROM user WHERE id = ?",
        userId
    );

    if (results.length > 0) {
        return results[0];
    }

    return null;
}
