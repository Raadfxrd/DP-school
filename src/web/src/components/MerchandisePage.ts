import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MerchandiseService } from "../services/MerchService";
import { merch } from "@shared/types";

@customElement("merchandise-page")
export class MerchandisePage extends LitElement {
    @state() private merchandise: merch[] = [];

    private merchandiseService = new MerchandiseService();

    public static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 50vh;
            padding: 16px;
        }

        .merch-container {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .merch-item {
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

        .merch-item img {
            width: 450px;
            height: 450px;
            max-width: 100%;
        }

        .merch-item h2 {
            align-self: stretch;
            text-align: center;
        }

        .merch-item p {
            margin: 8px 0;
        }

        .merch-item .price {
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
    `;

    public connectedCallback(): void {
        super.connectedCallback();
        void this.fetchMerchandise();
    }

    public async fetchMerchandise(): Promise<void> {
        try {
            const data: merch[] | undefined = await this.merchandiseService.getAllMerchandise();
            this.merchandise = data ? data : [];
        } catch (error) {
            console.error("Failed to fetch merchandise items:", error);
            this.merchandise = [];
        }
    }

    private handleDetailsClick(item: merch): void {
        this.dispatchEvent(
            new CustomEvent("navigate-to-product", {
                detail: { item },
                bubbles: true,
                composed: true,
            })
        );
    }

    public render(): TemplateResult<1> {
        return html`
            <h1>Merchandise</h1>
            <div class="merch-container">
                ${this.merchandise.length > 0
                    ? this.merchandise.map(
                          (item) => html`
                              <div class="merch-item">
                                  <img src="${item.thumbnail}" alt="${item.title}" />
                                  <h2>${item.title}</h2>
                                  <p>${item.description}</p>
                                  <p>Authors: ${item.authors}</p>
                                  <p>Tags: ${item.tags}</p>
                                  <p class="price">$${item.price}</p>
                                  <button class="details" @click=${(): void => this.handleDetailsClick(item)}>
                                      View details
                                  </button>
                              </div>
                          `
                      )
                    : html`<p>No merchandise available at the moment.</p>`}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "merchandise-page": MerchandisePage;
    }
}
