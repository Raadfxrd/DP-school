import { OrderItem } from "@shared/types";

export class OrderItemService {
    public async getAll(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}orderItems`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    
}
