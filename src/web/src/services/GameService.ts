/* eslint-disable @typescript-eslint/typedef */
import { game } from "@shared/types/game";
import { TokenService } from "./TokenService";

export class GamesService {
    private tokenService: TokenService = new TokenService();
    private apiUrl: string = viteConfiguration.API_URL; // Ensure viteConfiguration.API_URL is correctly set

    public async getAllGames(): Promise<game[] | undefined> {
        try {
            const token = this.tokenService.getToken();
            if (!token) {
                console.error("No token found");
                return undefined;
            }

            const url: string = `${this.apiUrl}/Game`; // Ensure the endpoint is correct
            console.log(`Fetching URL: ${url}`);

            const response: Response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Ensure the token is added
                },
            });

            if (response.ok) {
                return response.json() as Promise<game[]>;
            } else {
                console.error(`Failed to fetch game items: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
        }

        return undefined;
    }
}
