import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
//import { product } from "@shared/types/OrderItem";
import { GamesService } from "../services/GameService";
import { game} from "@shared/types";

@customElement("game-page")
export class GamePage extends LitElement {
    @state() private games: game[] = [];

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
    gap: 16px; /* Optioneel: voeg wat ruimte toe tussen de game-items */
}

.game-item {
    padding: 20px;
            padding-top: 0px;
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
            const data = await this.gameService.getAllgame();
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
