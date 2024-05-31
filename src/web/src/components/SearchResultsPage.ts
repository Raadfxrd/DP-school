import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrderItemService } from "../services/OrderItemService";
import { OrderItem } from "@shared/types/OrderItem";
import { RouterPage } from "./Root";

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
    `;

    @property({ type: String })
    public query: string = "";

    @property({ type: Array })
    public searchResults: OrderItem[] = [];

    @state()
    public _currentPage: RouterPage = RouterPage.SearchResults;

    @state()
    private selectedProduct: OrderItem | undefined = undefined;

    private orderItemService: OrderItemService = new OrderItemService();

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.firstUpdated();
        this.requestUpdate();
    }

    private handleDetailsClick(orderItem: OrderItem): void {
        console.log("Dispatching product details", orderItem);
        const event: CustomEvent<{
            orderItem: OrderItem;
        }> = new CustomEvent("navigate-to-product", {
            detail: { orderItem },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    public async firstUpdated(): Promise<void> {
        if (this.query) {
            try {
                const results: OrderItem[] | undefined = await this.orderItemService.search(this.query);
                if (results) {
                    this.searchResults = results.map((item) => {
                        return {
                            id: item.id,
                            title: item.title,
                            thumbnail: item.thumbnail,
                            images: item.images,
                            description: item.description,
                            authors: item.authors,
                            tags: item.tags,
                            price: item.price,
                            quantity: item.quantity,
                        };
                    });
                } else {
                    this.searchResults = [];
                }
            } catch (error) {}
        }
    }

    // In SearchResultsPage
    public render(): TemplateResult {
        return html`
            <div>
                <h2>Search Results for "${this.query}"</h2>
                ${this.searchResults.length > 0
                    ? html`<ul>
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
                      </ul>`
                    : html`<p>No results found</p>`}
            </div>
        `;
    }
}
