import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { UserService } from "../services/UserService";

@customElement("product-page")
export class ProductPage extends LitElement {
    @property({ type: Object }) private productData!: OrderItem;
    @property({ type: Boolean }) private _isLoggedIn: boolean = false;
    @property({ type: Number }) public cartItemsCount: number = 0;
    @property({ type: Array }) public images: string[] = [];

    private userService: UserService = new UserService();
    private currentImageIndex: number = 0;

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

        .product-thumb {
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: fit-content;
            padding: 50px;
            background: #f0f0f0;
            position: relative;
        }

        .product-thumb img {
            width: 500px;
            height: 500px;
        }

        .product-thumbs {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }

        .product-thumbs img {
            width: 80px;
            height: 80px;
            margin: 0 5px;
            cursor: pointer;
            object-fit: cover;
            border: 2px solid transparent;
            transition: border-color 0.3s;
        }

        .product-thumbs img.selected {
            border-color: #000;
        }

        .product-thumb button {
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

        .product-thumb button:hover {
            background-color: #8e7996;
        }

        .product-thumb button:focus {
            outline: none;
        }

        .product-thumb button:active {
            transform: translateY(1px);
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

        .description {
            font-size: 15px;
            line-height: 22px;
            margin-bottom: 18px;
            color: #999;
            text-align: center;
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
            background-color: #f81c39;
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

    public setLoggedInStatus(isLoggedIn: boolean): void {
        this._isLoggedIn = isLoggedIn;
    }

    public async addToCart(): Promise<void> {
        if (this._isLoggedIn) {
            const result: number | undefined = await this.userService.addOrderItemToCart(this.productData.id);

            if (result) {
                this.cartItemsCount = result;
            } else {
                console.error("Failed to add item to cart.");
            }
        }
    }

    private selectImage(index: number): void {
        this.currentImageIndex = index;
        this.requestUpdate();
    }

    public render(): TemplateResult {
        console.log("Rendering with productData", this.productData);
        if (!this.productData) {
            return html`<div>No product data available</div>`;
        }

        if (typeof this.productData.images === "string") {
            (this.productData.images as string).split(", ");
        }
        let allImages: string[] = [];
        if (this.productData.thumbnail) {
            allImages.push(this.productData.thumbnail);
        }
        if (this.productData.images && this.productData.images.length > 0) {
            allImages = [...allImages, ...this.productData.images];
        }

        if (allImages.length === 0) {
            console.log("No images available for this product");
            return html`<div>No images available</div>`;
        }

        if (this.currentImageIndex < 0 || this.currentImageIndex >= allImages.length) {
            console.error("Invalid currentImageIndex: ", this.currentImageIndex);
            return html`<div>Invalid image index</div>`;
        }

        return html`
            <div class="product-card">
                <div class="badge">New</div>
                <div class="product-thumb">
                    ${allImages.length > 1 ? html`<button @click=${this.prevImage}><</button>` : null}
                    <img src="${allImages[this.currentImageIndex]}" alt="${this.productData.title}" />
                    ${allImages.length > 1 ? html`<button @click=${this.nextImage}>></button>` : null}
                </div>
                <div class="product-thumbs">
                    ${allImages.map(
                        (img: string, index: number) =>
                            html`<img
                                src="${img}"
                                @click=${(): void => this.selectImage(index)}
                                class="${this.currentImageIndex === index ? "selected" : ""}"
                            />`
                    )}
                </div>
                <div class="product-details">
                    <div class="title-price">
                        <h4 class="title">${this.productData.title}</h4>
                        <div class="price">Price: €${this.productData.price}</div>
                    </div>
                    ${this.productData.tags.includes("merch")
                        ? null
                        : html`<div class="authors">Authors: ${this.productData.authors}</div>`}
                    <div class="product-links">
                        <p class="description">${this.productData.description}</p>
                        <button class="add-to-cart-btn" @click=${this.addToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    private prevImage(): void {
        const allImages: string[] = this.getAllImages();
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = allImages.length - 1;
        }
        this.requestUpdate();
    }

    private nextImage(): void {
        const allImages: string[] = this.getAllImages();
        if (this.currentImageIndex < allImages.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0;
        }
        this.requestUpdate();
    }

    private getAllImages(): string[] {
        let allImages: string[] = [];
        if (this.productData.thumbnail) {
            allImages.push(this.productData.thumbnail);
        }
        if (this.productData.images && this.productData.images.length > 0) {
            allImages = [...allImages, ...this.productData.images];
        }
        return allImages;
    }
}
