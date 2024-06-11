import { Product } from "@shared/types/Product";

export class AdminPanelService {
    private apiUrl = 'http://your-api-url.com/api'; 

    public async getProducts(page: number, limit: number): Promise<{ products: Product[], page: number, pages: number, limit: number } | undefined> {
        const response = await fetch(`${this.apiUrl}/products?page=${page}&limit=${limit}`);
        if (response.ok) {
            return response.json();
        }
        console.error("Failed to fetch products", response.statusText);
        return undefined;
    }

    public async getProduct(id: number): Promise<Product | undefined> {
        const response = await fetch(`${this.apiUrl}/products/${id}`);
        if (response.ok) {
            return response.json();
        }
        console.error("Failed to fetch product", response.statusText);
        return undefined;
    }

    public async createProduct(product: Partial<Product>): Promise<{ errors: any[], data: Product | null }> {
        const response = await fetch(`${this.apiUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        if (response.ok) {
            return response.json();
        }
        console.error("Failed to create product", response.statusText);
        return { errors: [{ message: "Failed to create product" }], data: null };
    }

    public async updateProduct(id: number, product: Partial<Product>): Promise<any[]> {
        const response = await fetch(`${this.apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        if (response.ok) {
            return [];
        }
        console.error("Failed to update product", response.statusText);
        return [{ message: "Failed to update product" }];
    }

    public async deleteProduct(id: number): Promise<void> {
        const response = await fetch(`${this.apiUrl}/products/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error("Failed to delete product", response.statusText);
        }
    }
}
