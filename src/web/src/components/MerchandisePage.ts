import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MerchandiseService } from "../services/MerchService";
import { merch } from "@shared/types";

@customElement("merchandise-page")
export class MerchandisePage extends LitElement {
    @state() private merchandise: merch[] = [];
    @state() private selectedMerch: merch | null = null;
    @state() private _currentPage: string = "home";

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
            justify-content: center;
        }

        .merch-item {
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

        .merch-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        .merch-details img {
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
        this.navigateToPage("details", item);
    }

    private navigateToPage(page: string, item: merch | null = null): void {
        this._currentPage = page;
        this.selectedMerch = item;
        this.requestUpdate();
    }

    private truncateDescription(description: string | undefined): string {
        return description && description.length > 30 ? `${description.substring(0, 30)}...` : description || "";
    }

    private renderMerchList(): TemplateResult {
        return html`
            <h1>Merchandise</h1>
            <div class="merch-container">
                ${this.merchandise.length > 0 ? this.merchandise.map(
                    (item) => html`
                        <div class="merch-item">
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
                ) : html`<p>No merchandise available at the moment.</p>`}
            </div>
        `;
    }

    private renderMerchDetails(): TemplateResult {
        if (!this.selectedMerch) {
            return html`<p>No merchandise selected.</p>`;
        }

        return html`
            <div class="merch-details">
                <img src="${this.selectedMerch.thumbnail}" alt="${this.selectedMerch.title}" />
                <h2>${this.selectedMerch.title}</h2>
                <p>${this.selectedMerch.description}</p>
                <p>Authors: ${this.selectedMerch.authors}</p>
                <p>Tags: ${this.selectedMerch.tags}</p>
                <p class="price">$${this.selectedMerch.price}</p>
                <button class="back-button" @click=${(): void => this.navigateToPage("home")}>
                    Back to Merchandise
                </button>
            </div>
        `;
    }

    public render(): TemplateResult {
        return this._currentPage === "home" ? this.renderMerchList() : this.renderMerchDetails();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "merchandise-page": MerchandisePage;
    }
}
