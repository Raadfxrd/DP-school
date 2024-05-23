import { OrderItem } from "@shared/types";

export class OrderItemService {
    public async getAll(): Promise<OrderItem[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL;
        console.log("API_URL:", apiUrl);
        const url: string = `${apiUrl}products`;
        console.log(`Fetching URL: ${url}`);

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems`, {
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
}
