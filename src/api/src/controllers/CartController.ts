import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { OrderItem } from "@shared/types/OrderItem";

export class CartController {
    public async insertCart(_req: Request, res: Response): Promise<void> {
        console.log("Fetching products");
        try {
            const result: OrderItem[] = await queryDatabase<OrderItem[]>(
                "INSERT INTO `cart`(`user_id`, `product_id`, `amount`) VALUES ('?','?','1')",
                sessionStorage.id,
                productId
            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        console.log("Fetching products");
        try {
            const cartIdReader: number[] = await queryDatabase<number[]>(
                "SELECT product_id FROM cart WHERE user_id = ?",
                sessionStorage.id
            );
            const result: OrderItem[] = await queryDatabase<OrderItem[]>(
                "SELECT id, title, thumbnail, images, description, authors, tags, price FROM product WHERE id = ?",
                cartIdReader
            );
            res.json(result);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
