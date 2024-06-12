import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { merch } from "@shared/types/merch";

export class MerchandiseController {
    public async getMerchandise(_req: Request, res: Response): Promise<void> {
        console.log("Fetching merchandise products");
        try {
            const result: merch[] = await queryDatabase<merch[]>(
                "SELECT * FROM product WHERE tags = 'merch'"

            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
