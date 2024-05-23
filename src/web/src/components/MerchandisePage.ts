import { LitElement, html, css, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("merchandise-page")
export class MerchandisePage extends LitElement {
    public static styles = css`
        /* your CSS here */
    `;

    protected render(): TemplateResult {
        return html`
            <div>
                <h1>Merch</h1>
                <p>Welcome to the Merch page!</p>
                <!-- Add more game-specific content here -->
            </div>
        `;
    }
}
