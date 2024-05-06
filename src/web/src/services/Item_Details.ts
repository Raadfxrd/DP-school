import { OrderItem } from "@shared/types";

export class ItemDetailService {
    /**
     * Get all item details
     *
     * @returns A list of all item details when successful, otherwise `undefined`.
     */
    public async getAll(): Promise<OrderItem[] | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}itemDetails`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as OrderItem[];
    }

    /**
     * Get item detail by ID
     *
     * @param id The ID of the item detail to retrieve
     * @returns The item detail object when successful, otherwise `undefined`.
     */
    public async getById(id: string): Promise<OrderItem | undefined> {
        const response: Response = await fetch(`${viteConfiguration.API_URL}itemDetails/${id}`, {
            method: "get",
        });

        if (!response.ok) {
            console.error(response);
            return undefined;
        }

        return (await response.json()) as OrderItem;
    }

    // Voeg hier andere methoden toe, zoals toevoegen, bijwerken en verwijderen van itemdetails
}
