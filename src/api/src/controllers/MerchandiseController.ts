import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { product } from "@shared/types/OrderItem";

export class MerchandiseController {
    public static getMerchandise: any;
    public async getAll(_req: Request, res: Response): Promise<void> {
        console.log("Fetching products");
        try {
            const result: product[] = await queryDatabase<product[]>(
                "SELECT id, title, thumbnail, images, description, authors, tags, price FROM product"
            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async getMerchandise(_req: Request, res: Response): Promise<void> {
        console.log("Fetching merchandise products");
        try {
            const result: product[] = await queryDatabase<product[]>(
                "SELECT id, title, thumbnail, images, description, authors, tags, price FROM product WHERE tags '%merch%'"
            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
