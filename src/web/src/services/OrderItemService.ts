import { product } from "@shared/types/OrderItem";
import { TokenService } from "./TokenService";

export class OrderItemService {
    private tokenService: TokenService = new TokenService();

    public async getAll(): Promise<product[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL;
        console.log("API_URL:", apiUrl);
        const url: string = `${apiUrl}products`;
        console.log(`Fetching URL: ${url}`);

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
            console.error("Failed to fetch order items:", response.statusText);
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        return undefined;
    }
}
