import { game } from "@shared/types/game";
import { TokenService } from "./TokenService";

export class GamesService {
    private tokenService: TokenService = new TokenService();

    public async getAllGames(): Promise<game[] | undefined> {
        const apiUrl: string = viteConfiguration.API_URL; // Ensure viteConfiguration.API_URL is correctly set
        console.log("API_URL:", apiUrl);
        const url: string = `${apiUrl}/games`; // Ensure the endpoint is correct
        console.log(`Fetching URL: ${url}`);

        // eslint-disable-next-line @typescript-eslint/typedef
        const token = this.tokenService.getToken();
        if (!token) {
            console.error("No token found");
            return undefined;
        }

        try {
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
