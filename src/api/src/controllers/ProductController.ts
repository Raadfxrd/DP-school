import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { OrderItem } from "@shared/types/OrderItem";

export class ProductController {
    public async getAll(_req: Request, res: Response): Promise<void> {
        console.log("Fetching products");
        try {
            const result: OrderItem[] = await queryDatabase<OrderItem[]>(
                "SELECT id, title, thumbnail, images, description, authors, tags, price FROM product"
            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
