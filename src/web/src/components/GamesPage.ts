import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
//import { product } from "@shared/types/OrderItem";
import { GamesService } from "../services/GameService";
import { merch } from "@shared/types";

@customElement("game-page")
export class GamePage extends LitElement {
    @state() private games: merch[] = [];

    private gameService = new GamesService();

    public static styles = css`
        :host {
            display: block;
            padding: 16px;
        }
        .game-item {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .game-item img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .game-item h2 {
            margin: 8px 0;
            font-size: 1.5rem;
        }
        .game-item p {
            margin: 8px 0;
        }
        .game-item .price {
            font-weight: bold;
            margin-top: 8px;
        }
    `;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public connectedCallback() {
        super.connectedCallback();
        void this.fetchGames();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public async fetchGames() {
        
        try {
            // eslint-disable-next-line @typescript-eslint/typedef
            const data = await this.gameService.getAllGames();
            if (data) {
                this.games = data;
            } else {
                this.games = [];
            }
        } catch (error) {
            console.error("Failed to fetch game items:", error);
            this.games = [];
        }
    }
    

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        return html`
            <h1>Games</h1>
            <div>
                ${this.games.length > 0 ? this.games.map(
                    (item) => html`
                       <div class="game-item">
                            <img src="${item.thumbnail}" alt="${item.title}" />
                            <h2>${item.title}</h2>
                            <p>${item.description}</p>
                            <p>Authors: ${item.authors}</p>
                            <p>Tags: ${item.tags}</p>
                            <p class="price">$${item.price}</p>
                        </div>
                    `
                ) : html`<p>No games available at the moment.</p>`}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "game-page": GamePage;
    }
}
