import { product } from "@shared/types/OrderItem";
import { TokenService } from "./TokenService";

export class OrderItemService {
    private tokenService: TokenService = new TokenService();

    public async getAllMerchandise(): Promise<product[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL; // Assuming you have this configuration available
        console.log("API_URL:", apiUrl);
        const url: string = `${apiUrl}merchandise`; // Assuming the endpoint for merchandise items is different
        console.log(`Fetching Merchandise URL: ${url}`);

        try {
            const response: Response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.tokenService.getToken()}`, // Ensure the token is added
                },
            });
            if (response.ok) {
                return response.json() as Promise<product[]>;
            }
            console.error("Failed to fetch merchandise items:", response.statusText);
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        return undefined;
    }
}