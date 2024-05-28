import { OrderItem } from "@shared/types/OrderItem";

export class ItemDetailService {
    public async getAll(): Promise<OrderItem[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL;
        const url: string = `${apiUrl}itemDetails`;
        console.log(`Fetching URL: ${url}`);

        try {
            const response: Response = await fetch(url, {
                method: "get",
            });

            if (!response.ok) {
                console.error("Failed to fetch item details:", response);
                return undefined;
            }

            return (await response.json()) as OrderItem[];
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        return undefined;
    }

    public async getById(id: string): Promise<OrderItem | undefined> {
        const apiUrl: string = viteConfiguration.API_URL;
        const url: string = `${apiUrl}itemDetails/${id}`;
        console.log(`Fetching URL: ${url}`);

        try {
            const response: Response = await fetch(url, {
                method: "get",
            });

            if (!response.ok) {
                console.error("Failed to fetch item detail by ID:", response);
                return undefined;
            }

            return (await response.json()) as OrderItem;
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        return undefined;
    }
}
