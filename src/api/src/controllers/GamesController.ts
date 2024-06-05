import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { product } from "@shared/types/OrderItem";

export class GamesController {
    public async getGames(_req: Request, res: Response): Promise<void> {
        console.log("Fetching games products");
        try {
            const result: product[] = await queryDatabase<product[]>(
                "SELECT * FROM product WHERE tags LIKE '%game%'"

            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}