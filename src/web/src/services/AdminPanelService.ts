import { Product } from "@shared/types/Product";
import { api } from "@hboictcloud/api";

export class AdminPanelService {
    private baseUrl = "/api/products";

    public async getProducts(page: number, limit: number): Promise<{ products: Product[], page: number, pages: number, limit: number }> {
        const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`);
        return response.json();
    }

    public async getProduct(id: number): Promise<Product> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        return response.json();
    }

    public async createProduct(product: Product): Promise<{ errors: any[], data: Product }> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        return response.json();
    }

    public async updateProduct(id: number, product: Product): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        return response.json();
    }

    public async deleteProduct(id: number): Promise<void> {
        await fetch(`${this.baseUrl}/${id}`, {
            method: "DELETE",
        });
    }

    public async uploadFile(fileName: string, dataUrl: string, overwrite: boolean = false): Promise<string> {
        try {
            const uploadResponse = await api.uploadFile(fileName, dataUrl, overwrite);
            if (typeof uploadResponse === "string") {
                return uploadResponse;
            } else {
                throw new Error("Upload failed");
            }
        } catch (error: any) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    public async readFileAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to read file as data URL."));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
