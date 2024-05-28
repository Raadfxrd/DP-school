import { LitElement, TemplateResult, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItemService } from "../services/OrderItemService";
import { OrderItem } from "@shared/types/OrderItem";

@customElement("search-results-page")
export class SearchResultsPage extends LitElement {
    @property({ type: String })
    public query: string = "";

    @property({ type: Array })
    public searchResults: OrderItem[] = [];

    private orderItemService: OrderItemService = new OrderItemService();

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

    public async firstUpdated(): Promise<void> {
        console.log(`Fetching search results for query: ${this.query}`);
        if (this.query) {
            try {
                const results: OrderItem[] | undefined = await this.orderItemService.search(this.query);
                if (results) {
                    this.searchResults = results.map((item) => {
                        console.log("Processing item:", item);
                        return {
                            ...item,
                            thumbnail: `data:image/png;base64,${Buffer.from(item.thumbnail).toString(
                                "base64"
                            )}`,
                            images: item.images.map(
                                (image) => `data:image/png;base64,${Buffer.from(image).toString("base64")}`
                            ),
                        };
                    });
                    console.log("Processed search results:", this.searchResults);
                } else {
                    this.searchResults = [];
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        }
    }

    public render(): TemplateResult {
        console.log("Rendering search results:", this.searchResults);
        return html`
            <div>
                <h2>Search Results for "${this.query}"</h2>
                ${this.searchResults.length > 0
                    ? html`<ul>
                          ${this.searchResults.map(
                              (item) => html`
                                  <li class="search-result-item">
                                      <img src="${item.thumbnail}" alt="${item.title}" />
                                      <div class="search-result-info">
                                          <h4>${item.title}</h4>
                                          <p>${item.description}</p>
                                          <p>Authors: ${item.authors.join(", ")}</p>
                                          <p>Tags: ${item.tags.join(", ")}</p>
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
