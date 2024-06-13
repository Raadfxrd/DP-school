import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "./TokenService";

export class AdminPanelService {
    private apiUrl: string = viteConfiguration.API_URL;
    private tokenService: TokenService = new TokenService();

    private getHeaders(): HeadersInit {
        const token: string | undefined = this.tokenService.getToken();
        console.log("Token Retrieved:", token);
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
    }

    public async getProducts(): Promise<{ products: OrderItem[]; page: number; pages: number; limit: number }> {
        const response: Response = await fetch(`${this.apiUrl}orderItems`, {
            headers: this.getHeaders(),
        });
        return response.json();
    }

    public async getProduct(id: number): Promise<OrderItem> {
        const response: Response = await fetch(`${this.apiUrl}orderItems/${id}`, {
            headers: this.getHeaders(),
        });
        return response.json();
    }

    public async createProduct(product: OrderItem): Promise<{ errors: any[]; data: OrderItem }> {
        type FormattedProduct = {
            id: number;
            title: string;
            description: string;
            price: number;
            thumbnail: string;
            images: string[];
            authors: string;
            tags: string;
            quantity: number;
        };

        const formattedProduct: FormattedProduct = {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            images: product.images,
            authors: JSON.stringify(product.authors),
            tags: JSON.stringify(product.tags),
            quantity: product.quantity,
        };

        const response: Response = await fetch(`${this.apiUrl}products`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(formattedProduct),
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error("Error Response: ", errorText);
            throw new Error(response.statusText);
        }

        return response.json();
    }

    public async updateProduct(id: number, product: Partial<OrderItem>): Promise<{ errors: any[]; data: OrderItem }> {
        const response: Response = await fetch(`${this.apiUrl}products/${id}`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error("Error Response: ", errorText);
            throw new Error(response.statusText);
        }

        return response.json();
    }

    public async deleteProduct(id: number): Promise<void> {
        const response: Response = await fetch(`${this.apiUrl}products/${id}`, {
            method: "DELETE",
            headers: this.getHeaders(),
        });

        if (response.status === 401) {
            console.error("Unauthorized Error: ", await response.text());
            throw new Error("Unauthorized");
        }

        if (response.status === 404) {
            console.error("Not Found Error: ", await response.text());
            throw new Error("Not Found");
        }
    }
}
