//game controller 
import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { game } from "@shared/types/game";

export class GamesController {
    public async getGames(_req: Request, res: Response): Promise<void> {
        console.log("Fetching games products");
        try {
            const result: game[] = await queryDatabase<game[]>(
                "SELECT * FROM product WHERE tags = 'game';"

            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}