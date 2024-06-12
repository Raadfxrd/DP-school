import { game } from "@shared/types/game";
import { TokenService } from "./TokenService";

export class GamesService {
    private tokenService: TokenService = new TokenService();

    public async getAllgame(): Promise<game[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL; // Assuming you have this configuration available
        console.log("API_URL:", apiUrl);
        const url: string = `${apiUrl}game`; // Assuming the endpoint for merchandise items is different
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
                return response.json() as Promise<game[]>;
            }
            console.error("Failed to fetch merchandise items:", response.statusText);
        } catch (error) {
            console.error("Error during fetch:", error);
        }
        return undefined;
    }
}