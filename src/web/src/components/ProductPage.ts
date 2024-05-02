import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";

@customElement("product-page")
export class ProductPage extends LitElement {
    @property({ type: Object }) public productData!: OrderItem;
    public static styles = css`
    .product-details{
        border: 3px solid #c4aad0;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background-color: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    }
    .product-details img {
            width: 100%;
            max-width: 400px;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-right: 20px 
        }

        .product-details h2 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #333;
        }

        .product-details .price {
            font-size: 1.5rem;
            font-weight: bold;
            color: #c4aad0;
            margin-top: 10px;
            margin-bottom: 20px;
        }

        .product-details .description {
            font-size: 40px;
            line-height: 1.5;
            color: #666;
            margin-bottom: 20px;
        }

       

      
    `;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        if (!this.productData) {
            return html`<div>No product data available</div>`;
        }

        return html`
             <div class="product-details">
                <h2>${this.productData.name}</h2>
                <div>
                    <img src="${this.productData.imageURLs}" alt="${this.productData.name}" />
                    <p class="price">Price: €${this.productData.price}</p>
                </div>
                <p class="description">${this.productData.description}</p>
            </div>
        `;
    }


}

