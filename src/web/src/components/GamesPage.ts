import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { GamesService } from "../services/GameService";
import { game } from "@shared/types";

@customElement("game-page")
export class GamePage extends LitElement {
    @state() private games: game[] = [];
    @state() private selectedGame: game | null = null;
    @state() private _currentPage: string = "home";

    private gameService = new GamesService();

    public static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 50vh;
            padding: 16px;
        }

        .game-container {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
        }

        .game-item {
            flex: 1 1 300px;
            padding: 20px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            height: 700px;
        }

        .game-item img {
            width: 450px;
            height: 450px;
            max-width: 100%;
        }

        .game-item h2 {
            align-self: stretch;
            text-align: center;
        }

        .game-item p {
            margin: 8px 0;
        }

        .game-item .price {
            margin-top: 20px;
            align-self: flex-end;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .details {
            margin-top: 10px;
            padding: 10px 20px;
            font-size: 1rem;
            color: white;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }

        .details:hover {
            background-color: #0056b3;
        }

        .game-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        .game-details img {
            width: 100%;
            height: auto;
            max-width: 450px;
            max-height: 450px;
        }

        .back-button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1rem;
            color: white;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }

        .back-button:hover {
            background-color: #0056b3;
        }
    `;

    public connectedCallback(): void {
        super.connectedCallback();
        void this.fetchGames();
    }

    public async fetchGames(): Promise<void> {
        try {
            // eslint-disable-next-line @typescript-eslint/typedef
            const data = await this.gameService.getAllgame();
            this.games = data ? data : [];
        } catch (error) {
            console.error("Failed to fetch game items:", error);
            this.games = [];
        }
    }

    private handleDetailsClick(game: game): void {
        this.navigateToPage("details", game);
    }

    private navigateToPage(page: string, game: game | null = null): void {
        this._currentPage = page;
        this.selectedGame = game;
        this.requestUpdate();
    }

    private truncateDescription(description: string | undefined): string {
        return description && description.length > 30 ? `${description.substring(0, 30)}...` : description || "";
    }

    private renderGameList(): TemplateResult {
        return html`
            <h1>Games</h1>
            <div class="game-container">
                ${this.games.length > 0 ? this.games.map(
                    (item) => html`
                        <div class="game-item">
                            <img src="${item.thumbnail}" alt="${item.title}" />
                            <h2>${item.title}</h2>
                            <p>${this.truncateDescription(item.description)}</p>
                            <p>Authors: ${item.authors}</p>
                            <p>Tags: ${item.tags}</p>
                            <p class="price">$${item.price}</p>
                            <button class="details" @click=${(): void => this.handleDetailsClick(item)}>
                                View details
                            </button>
                        </div>
                    `
                ) : html`<p>No games available at the moment.</p>`}
            </div>
        `;
    }

    private renderGameDetails(): TemplateResult {
        if (!this.selectedGame) {
            return html`<p>No game selected.</p>`;
        }

        return html`
            <div class="game-details">
                <img src="${this.selectedGame.thumbnail}" alt="${this.selectedGame.title}" />
                <h2>${this.selectedGame.title}</h2>
                <p>${this.selectedGame.description}</p>
                <p>Authors: ${this.selectedGame.authors}</p>
                <p>Tags: ${this.selectedGame.tags}</p>
                <p class="price">$${this.selectedGame.price}</p>
                <button class="back-button" @click=${(): void => this.navigateToPage("home")}>
                    Back to Games
                </button>
            </div>
        `;
    }

    public render(): TemplateResult {
        return this._currentPage === "home" ? this.renderGameList() : this.renderGameDetails();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "game-page": GamePage;
    }
}
