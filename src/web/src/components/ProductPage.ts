import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("product-page")
export class ProductPage extends LitElement {
    @property({ type: Object }) public productData: any; // Hier kun je de gegevens van het product doorgeven

    public static styles = css`
        /* Voeg hier je CSS-stijlen voor de productpagina toe */
    `;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        if (!this.productData) {
            return html`<div>Loading...</div>`;
        }

        return html`
            <div>
                <h1>${this.productData.name}</h1>
                <p>${this.productData.description}</p>
                <!-- Voeg hier andere details van het product toe -->
            </div>
        `;
    }
}
