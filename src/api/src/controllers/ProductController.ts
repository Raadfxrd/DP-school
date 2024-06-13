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
            const sqlQuery: string =
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

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { title, description, price, authors, tags, thumbnailUrl, imagesUrl } = req.body;

            console.log("Received Data:", req.body);

            const newProduct: OrderItem = {
                id: 0,
                title: title || "",
                description: description || "",
                price: price || 0,
                thumbnail: thumbnailUrl || "",
                images: imagesUrl || [],
                authors: authors || [],
                tags: tags || [],
                quantity: 0,
            };

            const sqlQuery: string =
                "INSERT INTO product (title, description, price, thumbnail, images, authors, tags ) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const sqlParams: any[] = [
                newProduct.title,
                newProduct.description,
                newProduct.price,
                newProduct.thumbnail,
                JSON.stringify(newProduct.images),
                JSON.stringify(newProduct.authors),
                JSON.stringify(newProduct.tags),
            ];
            const result: { insertId: number } = await queryDatabase<{ insertId: number }>(
                sqlQuery,
                ...sqlParams
            );
            newProduct.id = result.insertId;

            res.status(201).json(newProduct);
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            const { title, description, price, authors, tags, thumbnail, images } = req.body;

            const updatedProduct: Partial<OrderItem> = {
                title: title || "",
                description: description || "",
                price: price || 0,
                thumbnail: thumbnail || "",
                images: images || [],
                authors: authors || [],
                tags: tags || [],
            };

            const sqlQuery: string =
                "UPDATE product SET title = ?, description = ?, price = ?, thumbnail = ?, images = ?, authors = ?, tags = ? WHERE id = ?";
            const sqlParams: any[] = [
                updatedProduct.title,
                updatedProduct.description,
                updatedProduct.price,
                updatedProduct.thumbnail,
                JSON.stringify(updatedProduct.images),
                JSON.stringify(updatedProduct.authors),
                JSON.stringify(updatedProduct.tags),
                id,
            ];
            await queryDatabase(sqlQuery, ...sqlParams);

            res.json({ ...updatedProduct, id });
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const id: number = Number(req.params.id);
            await queryDatabase("DELETE FROM product WHERE id = ?", id);
            res.status(204).send();
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
