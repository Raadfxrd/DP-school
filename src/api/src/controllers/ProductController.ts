import { Request, Response } from "express";
import { queryDatabase } from "../../database/database";
import { OrderItem } from "@shared/types/OrderItem";
import { api } from "@hboictcloud/api"; // Removed unused import of `utils`

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

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { title, description, price, authors, tags, thumbnail, images } = req.body;

            // Upload thumbnail
            const thumbnailUrl = await api.uploadFile(`${title}_thumbnail.png`, thumbnail, true);

            // Upload images
            const imageUrls = await Promise.all(images.map((image: string, index: number) =>
                api.uploadFile(`${title}_image${index + 1}.png`, image, true)
            ));

            const newProduct: OrderItem = {
                title,
                description,
                price,
                thumbnail: thumbnailUrl as string,
                images: imageUrls as string[],
                authors,
                tags,
                id: 0,
                quantity: 0
            };

            const sqlQuery = "INSERT INTO product (title, description, price, thumbnail, images, authors, tags ) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const sqlParams = [title, description, price, thumbnailUrl, JSON.stringify(newProduct.images), JSON.stringify(authors), JSON.stringify(tags) ];
            const result = await queryDatabase<{ insertId: number }>(sqlQuery, ...sqlParams);
            newProduct.id = result.insertId;

            res.status(201).json(newProduct);
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { title, description, price, authors, tags, thumbnail, images } = req.body;

            // Upload thumbnail
            const thumbnailUrl = await api.uploadFile(`${title}_thumbnail.png`, thumbnail, true);

            // Upload images
            const imageUrls = await Promise.all(images.map((image: string, index: number) =>
                api.uploadFile(`${title}_image${index + 1}.png`, image, true)
            ));

            const updatedProduct: Partial<OrderItem> = {
                title,
                description,
                price,
                thumbnail: thumbnailUrl as string,
                images: imageUrls as string[],
                authors,
                tags,
            };

            const sqlQuery = "UPDATE product SET title = ?, description = ?, price = ?, thumbnail = ?, images = ?, authors = ?, tags = ? WHERE id = ?";
            const sqlParams = [title, description, price, thumbnailUrl, JSON.stringify(updatedProduct.images), JSON.stringify(authors), JSON.stringify(tags), id];
            await queryDatabase(sqlQuery, ...sqlParams);

            res.json({ ...updatedProduct, id });
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            await queryDatabase("DELETE FROM product WHERE id = ?", id);
            res.status(204).send();
        } catch (error: any) {
            console.error("Database Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
