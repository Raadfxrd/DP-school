import { game } from "@shared/types/game";
import { TokenService } from "./TokenService";

export class GamesService {
    private tokenService: TokenService = new TokenService();

    public async getAllgame(): Promise<game[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL;
        console.log("API_URL:", apiUrl);
        const url: string = `${apiUrl}game`;
        console.log(`Fetching URL: ${url}`);

        try {
            const response: Response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.tokenService.getToken()}`,
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
