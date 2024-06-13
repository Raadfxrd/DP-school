import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { TemplateResult } from "lit";
import { CartItem } from "@shared/types";

@customElement("cart-page")
export class CartPage extends LitElement {
    @property({ type: Object }) public productData!: CartItem;
    private _userService: UserService = new UserService();

    @property({ type: Number }) public cartItemsCount: number = 1;

    @state() private _cartItemsArray: CartItem[] = [];
    private userService: UserService = new UserService();

    @state()
    private _cartItem: CartItem[] | undefined = [];

    @state()
    private _currentPage: string | undefined;

    public static styles = css`
        .cart-body {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .my-cart-title {
            text-decoration: none;
            background-color: #fbfbfa;
            padding: 0px;
            font-size: 1.5rem;
            font-family: "Rubik Mono One", monospace;
            letter-spacing: -1px;
        }

        .game-cart-image {
            height: 100px;
            width: 150px;
            padding: 10px;
        }

        .badge {
            max-width: 30px;
            left: 0;
            margin-top: 0px;
            text-transform: uppercase;
            font-size: 13px;
            font-weight: 700;
            background: red;
            color: #fff;
            padding: 3px 10px;
        }

        .game-cart-item {
            display: flex;
            align-items: center;
            border: 1px solid #ddd;
            padding: 10px;
            margin-top: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            width: 70vw;
        }

        .game-badge {
            width: 40px;
            height: 40px;
            margin-right: 10px;
        }

        .game-info {
            flex: 1;
            background-color: #f0f0f0;
            display: flex;
            flex-direction: row;
        }

        .game-title {
            margin-bottom: 5px;
            text-decoration: none;
            padding: 0px;
            font-size: 1.2rem;
            font-family: "Rubik Mono One", monospace;
            letter-spacing: -1px;
        }

        .game-description {
            font-size: 14px;
            color: #aaa;
            margin-bottom: 10px;
            max-width: 500px;
        }

        .game-description-text {
            display: flex;
            flex-direction: column;
        }

        .game-amount {
            display: flex;
            flex-direction: column;
        }

        .game-price-quantity {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .game-price {
            font-weight: bold;
            margin-left: 40px;
            margin-top: 30px;
        }

        .quantity-control {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .quantity-btn {
            width: 20px;
            height: 20px;
            border: none;
            background-color: #ddd;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        }

        .quantity-btn.minus {
            margin-right: 5px;
        }

        .quantity {
            margin: 0 5px;
        }

        .remove-btn {
            background-color: #ddd;
            border: none;
            padding: 2px 2px;
            cursor: pointer;
            margin-right: 5px;
            margin-left: 20px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        }

        .remove-btn img {
            height: 13px;
        }

        .checkout-box {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .checkout-button {
            display: inline-block;
            width: 100%;
            height: 40px;
            background-color: #c4aad0;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-top: 10px;
        }

        .game-image {
            max-height: 10vh;
            max-width: 10vw;
        }

        .total-price {
            background-color: #ddd;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            margin-left: 20px;
            text-decoration: none;
            padding: 0px;
            font-size: 1.2rem;
            width: 300px;
            font-weight: bold;
        }
    `;

    private navigateToPage(page: string): void {
        this._currentPage = page;
        this.requestUpdate();
    }

    public async firstUpdated(): Promise<void> {
        await this.loadCartItems();
    }

    private async loadCartItems(): Promise<void> {
        this._cartItem = await this.userService.getItemFromCart();
        this._cartItemsArray = this._cartItem || [];
    }

    public load(): any {
        if (this._cartItemsArray === null) {
            return this.render();
        }
    }

    private renderOrderItem(cartItem: CartItem): TemplateResult {
        return html`
            <div class="product-box">
                <div class="game-cart-item">
                    <div class="game-info">
                        <div class="game-cart-image">
                            <div class="badge">New</div>
                            <img class="game-image" src="${cartItem.thumbnail}" />
                        </div>
                        <div class="game-description-text">
                            <p class="game-title">${cartItem.title}</p>
                            <p class="game-description">${cartItem.description}</p>
                        </div>
                    </div>
                    <div class="game-amount">
                        <div class="game-price-quantity">
                            <div class="quantity-control">
                                <button
                                    class="remove-btn"
                                    @click=${async (): Promise<void> => this.deleteAmountToCart(cartItem)}
                                >
                                    <img src="/assets/img/trash.png" />
                                </button>
                                <button
                                    class="quantity-btn minus"
                                    @click=${async (): Promise<void> => this.minusOneAmountToCart(cartItem)}
                                >
                                    -
                                </button>
                                <span class="quantity">${cartItem.amount}</span>
                                <button
                                    class="quantity-btn plus"
                                    @click=${async (): Promise<void> => this.addOneAmountToCart(cartItem)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <span class="game-price">${cartItem.price * cartItem.amount}</span>
                    </div>
                </div>
            </div>
        `;
    }

    private calculateTotalPrice(cartItems: CartItem[]): number {
        let totalPrice: number = 0;
        for (const cartItem of cartItems) {
            totalPrice += cartItem.price * cartItem.amount;
        }
        return totalPrice;
    }

    private async addOneAmountToCart(cartItem: CartItem): Promise<void> {
        const productId: number = cartItem.id;
        const result: number | undefined = await this._userService.amountPlusOne(productId);
        if (result !== undefined) {
            await this.loadCartItems();
        }
    }

    private async minusOneAmountToCart(cartItem: CartItem): Promise<void> {
        const productId: number = cartItem.id;
        const result: number | undefined = await this._userService.amountMinusOne(productId);
        if (result !== undefined) {
            await this.loadCartItems();
        }
    }

    private async deleteAmountToCart(cartItem: CartItem): Promise<void> {
        const productId: number = cartItem.id;
        const result: number | undefined = await this._userService.deleteItem(productId);
        if (result !== undefined) {
            await this.loadCartItems();
        }
    }

    public renderMyCartText(): TemplateResult {
        return html` <div class="my-cart-title">My Cart:</div>`;
    }

    public renderCheckout(): TemplateResult {
        return html`
            <div class="checkout-box">
                <button class="checkout-button" @click=${(): void => this.triggerNavigation()}>
                    Checkout
                </button>
                <div class="total-price">Total: €${this.calculateTotalPrice(this._cartItemsArray)}</div>
            </div>
        `;
    }

    private triggerNavigation(): void {
        this._currentPage = "checkout";
        this.requestUpdate();
    }

    public renderCheckoutPage(): TemplateResult {
        return html`<checkout-page></checkout-page> `;
    }

    public render(): TemplateResult {
        switch (this._currentPage) {
            case "checkout":
                return this.renderCheckoutPage();
            default:
                return html`
                    <div class="cart-body">
                        ${this._cartItemsArray.length === 0
                            ? html`<div>You have nothing in your cart.</div>`
                            : html`
                                  ${this.renderMyCartText()}
                                  ${this._cartItemsArray.map((e) => this.renderOrderItem(e))}
                                  ${this.renderCheckout()}
                              `}
                    </div>
                `;
        }
    }
}
