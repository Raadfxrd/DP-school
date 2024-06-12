import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";

export class FavoriteController {
    public async addFavorite(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).send("Unauthorized");
            return;
        }

        const userId: number = req.user.id;
        const { productId } = req.body;

        try {
            await queryDatabase(
                "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
                userId,
                productId
            );
            res.status(201).json({ message: "Product added to favorites." });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    public async getFavorites(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).send("Unauthorized");
            return;
        }
        console.log("------------------------------------------------------------------");
        const userId: number = req.user.id;
        try {
            // Eerst de product_ids ophalen uit de favorieten
            const favoritesQuery: string = "SELECT product_id FROM favorites WHERE user_id = ?";
            const favorites: { product_id: number }[] = await queryDatabase(favoritesQuery, userId);

            // Als er geen favorieten zijn, return een lege lijst
            if (favorites.length === 0) {
                res.status(200).json([]);
                return;
            }

            // Product IDs ophalen
            const productIds: number[] = favorites.map((favorite) => favorite.product_id);

            // Nu de producten ophalen die bij deze product_ids horen
            console.log("product" + productIds.join(","));
            const productsQuery: string = `SELECT * FROM product WHERE id IN (${productIds.join(",")})`;
            const products: any[] = await queryDatabase(productsQuery);

            res.status(200).json(products);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }
}
