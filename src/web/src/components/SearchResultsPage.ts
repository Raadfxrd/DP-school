import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItemService } from "../services/OrderItemService";
import { OrderItem } from "@shared/types/OrderItem";

@customElement("search-results-page")
export class SearchResultsPage extends LitElement {
    public static styles = css`
        .search-container {
            position: relative;
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            z-index: 10;
        }

        .search-result-item {
            display: flex;
            padding: 10px;
            cursor: pointer;
            animation: fadeIn 0.3s ease-out;
        }

        .search-result-item:hover {
            background-color: #f0f0f0;
        }

        .search-result-item img {
            width: 50px;
            height: auto;
            margin-right: 10px;
        }

        .search-result-info h4 {
            margin: 0;
        }

        .search-result-info p {
            margin: 5px 0 0 0;
            color: #555;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    @property({ type: String })
    public query: string = "";

    @property({ type: Array })
    public searchResults: OrderItem[] = [];

    private orderItemService: OrderItemService = new OrderItemService();

    public connectedCallback(): void {
        super.connectedCallback();
        void this.fetchResults();
    }

    public updated(changedProperties: Map<string | number | symbol, unknown>): void {
        if (changedProperties.has("query")) {
            void this.fetchResults();
        }
    }

    public async fetchResults(): Promise<void> {
        if (this.query) {
            try {
                const results: OrderItem[] | undefined = await this.orderItemService.search(this.query);
                this.searchResults = results ?? [];
            } catch (error) {
                console.error("Error during search:", error);
                this.searchResults = [];
            }
        } else {
            this.searchResults = [];
        }
    }

    private handleDetailsClick(item: OrderItem): void {
        this.dispatchEvent(
            new CustomEvent("navigate-to-product", {
                detail: { orderItem: item },
                bubbles: true,
                composed: true,
            })
        );
    }

    public render(): TemplateResult {
        return html`
            <div>
                <h2>Search Results for "${this.query}"</h2>
                ${this.searchResults.length > 0
                    ? html`
                          <ul>
                              ${this.searchResults.map(
                                  (item) => html`
                                      <li
                                          class="search-result-item"
                                          @click=${(): void => this.handleDetailsClick(item)}
                                      >
                                          <img src="${item.thumbnail}" alt="${item.title}" />
                                          <div class="search-result-info">
                                              <h4>${item.title}</h4>
                                              <p>${item.description}</p>
                                              <p>Authors: ${item.authors ? item.authors.join(", ") : ""}</p>
                                              <p>Tags: ${item.tags ? item.tags.join(", ") : ""}</p>
                                              <p>Price: €${item.price}</p>
                                              <p>Quantity: ${item.quantity}</p>
                                          </div>
                                      </li>
                                  `
                              )}
                          </ul>
                      `
                    : html`<p>No results found.</p>`}
            </div>
        `;
    }
}
