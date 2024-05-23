import { LitElement, html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("games-page")
export class GamesPage extends LitElement {
    public static styles = css`
        /* your CSS here */
    `;

    protected render(): TemplateResult {
        return html`
            <div>
                <h1>Games</h1>
                <p>Welcome to the Games page!</p>
                <!-- Add more game-specific content here -->
            </div>
        `;
    }
}
