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

    public async search(req: Request, res: Response): Promise<void> {
        const query: string = req.query.query as string;
        try {
            const sqlQuery: any =
                "SELECT id, title, thumbnail, images, description, price, authors, tags FROM product WHERE (title LIKE ? OR description LIKE ?) AND price > ? ORDER BY title ASC";
            const sqlParams: (string | number)[] = [`%${query}%`, `%${query}%`, 0];
            const result: OrderItem[] = await queryDatabase<OrderItem[]>(sqlQuery, ...sqlParams);
            console.log("Search results from database:", result);
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
