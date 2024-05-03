import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";

@customElement("product-page")
export class ProductPage extends LitElement {
    @property({ type: Object }) public productData!: OrderItem;

    public static styles = css`

.product-card {
    width: 800px;
    position: relative;
    box-shadow: 0 2px 7px #dfdfdf;
    margin: 50px auto;
    background: #fafafa;
}

.badge {
    position: absolute;
    left: 0;
    top: 20px;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    background: red;
    color: #fff;
    padding: 3px 10px;
}

.product-tumb {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    padding: 50px;
    background: #f0f0f0;
}

.product-tumb img {
    max-width: 150%;
    max-height: 120%;
}

.product-details {
    padding: 30px;
}

.title-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    display: block;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    color: #030101;
    margin-bottom: 10px;
}

.price {
    font-size: 18px;
    color: #fb2c2c;
    font-weight: 600;
}

.product-links p {
    font-size: 15px;
    line-height: 22px;
    margin-bottom: 18px;
    color: #999;
}

.add-to-cart-btn {
    display: inline-block;
    width: 100%;
    height: 40px;
    background-color: #c4aad0;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
}

.add-to-cart-btn:hover {
    background-color: #0056b3;
}

.add-to-cart-btn:focus {
    outline: none;
}

.add-to-cart-btn:active {
    transform: translateY(1px);
}

.product-links {
    text-align: right;
}

.product-links a {
    display: inline-block;
    margin-left: 5px;
    color: #e1e1e1;
    transition: 0.3s;
    font-size: 17px;
}

.product-links a:hover {
    color: #fbb72c;
}

        
    `;

    public addToCart(): void {
        if (this.productData) {
            // Dispatch een custom event "addToCart" met het productdata als detail
            this.dispatchEvent(new CustomEvent("addToCart", { detail: this.productData }));
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        if (!this.productData) {
            return html`<div>No product data available</div>`;
        }
    
        return html`
           <div class="product-card">
    <div class="badge">New</div>
    <div class="product-tumb">
        <img src="${this.productData.imageURLs}" alt="${this.productData.name}" />
    </div>
    <div class="product-details">
        <div class="title-price">
            <h4 class="title">${this.productData.name}</h4>
            <div class="price">Price: €${this.productData.price}</div>
        </div>
        <div class="product-links">
            <p class="description">${this.productData.description}</p>
            <button class="add-to-cart-btn" @click=${this.addToCart}>Add to Cart</button>
        </div>
    </div>
</div>

        `;
    }
    
    }

