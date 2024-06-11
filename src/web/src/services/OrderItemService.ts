import { OrderItem } from "@shared/types";

export class OrderItemService {
    private apiUrl: string = viteConfiguration.API_URL;

    public async getAll(): Promise<OrderItem[] | undefined> {
        const url: string = `${this.apiUrl}orderItems`;

        try {
            const response: Response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                return response.json() as Promise<OrderItem[]>;
            }
            console.error("Failed to fetch order items:", response.statusText);
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        return undefined;
    }

    public async search(query: string): Promise<OrderItem[] | undefined> {
        const url: string = `${this.apiUrl}orderItems/search?query=${encodeURIComponent(query)}`;

        try {
            const response: Response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data: string = await response.json();
                return data as unknown as OrderItem[];
            }
            console.error("Failed to search order items:", response.statusText);
        } catch (error) {
            console.error("Error during search:", error);
        }
        return undefined;
    }
}
