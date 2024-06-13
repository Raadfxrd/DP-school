import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "./TokenService";

export class AdminPanelService {
    private apiUrl: string = viteConfiguration.API_URL;
    private tokenService: TokenService = new TokenService();
    private token: string | undefined;

    public constructor() {
        this.token = this.tokenService.getToken();
        console.log("Token Retrieved:", this.token);
    }

    private getHeaders(): HeadersInit {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
        };
    }

    public async getProducts(): Promise<{
        products: OrderItem[];
        page: number;
        pages: number;
        limit: number;
    }> {
        const response: Response = await fetch(`${this.apiUrl}orderItems`, {
            headers: this.getHeaders(),
        });

        const data: any = await response.json();
        console.log("API Response in AdminPanelService:", data);
        return data;
    }

    public async getProduct(id: number): Promise<OrderItem> {
        const response: Response = await fetch(`${this.apiUrl}orderItems/${id}`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error("Error fetching product: ", errorText);
            throw new Error(response.statusText);
        }

        return response.json();
    }

    public async createProduct(product: OrderItem): Promise<{ errors: any[]; data: OrderItem }> {
        const response: Response = await fetch(`${this.apiUrl}orderItems`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error("Error creating product: ", errorText);
            throw new Error(response.statusText);
        }

        return response.json();
    }

    public async updateProduct(
        id: number,
        product: Partial<OrderItem>
    ): Promise<{ errors: any[]; data: OrderItem }> {
        const response: Response = await fetch(`${this.apiUrl}products/${id}`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error("Error updating product: ", errorText);
            throw new Error(response.statusText);
        }

        return response.json();
    }

    public async deleteProduct(id: number): Promise<void> {
        const response: Response = await fetch(`${this.apiUrl}products/${id}`, {
            method: "DELETE",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            console.error("Error deleting product: ", errorText);
            throw new Error(response.statusText);
        }
    }
}
