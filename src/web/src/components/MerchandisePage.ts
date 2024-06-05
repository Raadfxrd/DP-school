import { LitElement, html, css, } from "lit";
import { customElement, state } from "lit/decorators.js";
import { product } from "@shared/types/OrderItem";
import { MerchandiseService } from "../services/MerchService";

@customElement("merchandise-page")
export class MerchandisePage extends LitElement {
    @state() private merchandise: product[] = [];

    private merchandiseService = new MerchandiseService();

    public static styles = css`
        :host {
            display: block;
            padding: 16px;
        }
        .merch-item {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .merch-item img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .merch-item h2 {
            margin: 8px 0;
            font-size: 1.5rem;
        }
        .merch-item p {
            margin: 8px 0;
        }
        .merch-item .price {
            font-weight: bold;
            margin-top: 8px;
        }
    `;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public connectedCallback() {
        super.connectedCallback();
        void this.fetchMerchandise();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public async fetchMerchandise() {
        try {
            // eslint-disable-next-line @typescript-eslint/typedef
            const data = await this.merchandiseService.getAllMerchandise();
            if (data) {
                this.merchandise = data;
            } else {
                this.merchandise = [];
            }
        } catch (error) {
            console.error("Failed to fetch merchandise items:", error);
            this.merchandise = [];
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        return html`
            <h1>Merchandise</h1>
            <div>
                ${this.merchandise.length > 0 ? this.merchandise.map(
                    (item) => html`
                        <div class="mrech-item">
                            <img src="${item.thumbnail}" alt="${item.title}" />
                            <h2>${item.title}</h2>
                            <p>${item.description}</p>
                            <p>Authors: ${item.authors}</p>
                            <p>Tags: ${item.tags}</p>
                            <p class="price">$${item.price}</p>
                        </div>
                    `
                ) : html`<p>No merchandise available at the moment.</p>`}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "merchandise-page": MerchandisePage;
    }
}
