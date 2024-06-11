import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { UserService } from "../services/UserService";
import { TemplateResult } from "lit";

@customElement("cart-page")
export class CartPage extends LitElement {
    @property({ type: Object }) public productData!: OrderItem;
    private _userService: UserService = new UserService();
    @property({ type: Number }) public cartItemsCount: number = 1;

    @state() private _cartItemsArray: OrderItem[] = [];
    private userService: UserService = new UserService();

    @state()
    private _OrderItem: OrderItem[] = [];

    
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
            min-width: 700px;
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

    public async firstUpdated(): Promise<void> {
        await this.loadCartItems();
        console.log(this.getCartItems);
    }


    private async getCartItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._userService.getItemFromCart();
        if (result) {
            this._OrderItem = result;
            this._cartItemsArray = result;
        }
        console.log(result);
    }

    private async loadCartItems(): Promise<void> {
        const orderItems: Array<OrderItem> | undefined = await this.userService.getItemFromCart();
         const orderItem: TemplateResult[] = this._OrderItem.map((e) => this.renderOrderItem(e));
         console.log(orderItems);
         console.log(orderItem);

        }
    

    public load(): any {

        if (this._cartItemsArray === null) {
            console.log(this._cartItemsArray);
            return this.render();
        }
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
            <div class="product-box">
                <div class="game-cart-item">
                    <div class="game-info">
                        <div class="game-cart-image">
                            <div class="badge">New</div>
                            <img src="" />
                        </div>
                        <div class="game-description-text">
                            <p class="game-title">${orderItem.title}</p>
                            <p class="game-description">${orderItem.description}</p>
                        </div>
                    </div>
                    <div class="game-amount">
                        <div class="game-price-quantity">
                            <div class="quantity-control">
                                <button class="remove-btn">
                                    <img src="/assets/img/trash.png" />
                                </button>
                                <button
                                    class="quantity-btn minus"
                                    @click=${(): void => this.quantityCalculator(orderItem.quantity, -1)}
                                >
                                    -
                                </button>
                                <span class="quantity">${orderItem.quantity}</span>
                                <button
                                    class="quantity-btn plus"
                                    @click=${(): void => this.quantityCalculator(orderItem.quantity, 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <span class="game-price">${orderItem.price}</span>
                    </div>
                </div>
            </div>
        `;
    }

    

    private quantityCalculator(itemId: number, change: number): void {
        const updatedItems: OrderItem[] = this._cartItemsArray.map((OrderItem) => {
            if (OrderItem.quantity === itemId) {
                const newQuantity: number = Math.max(OrderItem.quantity + change, 1);
                return { ...OrderItem, quantity: newQuantity };
            }
            return OrderItem;
        });

        this._cartItemsArray = updatedItems;
    }

    private calculateTotalPrice(): number {
        return this._cartItemsArray.reduce((total, item) => total + item.price * item.quantity, 1);
    }

    public renderMyCartText(): TemplateResult {
        return html` <div class="my-cart-title">My Cart:</div>`;
    }

    public renderCheckout(): TemplateResult {
        return html` <div class="checkout-box">
            <button class="checkout-button">Checkout</button>
            <div class="total-price">Total:> €${this.calculateTotalPrice()}</div>
        </div>`;
    }

    public render(): TemplateResult{
        return html`
            <div class="cart-body">
                <p>Hallo</p>
                ${this._cartItemsArray.length
                    ? html`<div>Loading... Please wait a moment.</div>`
                    : html`
                          ${this.renderMyCartText()}
                          ${this._OrderItem.map((orderItem) => this.renderOrderItem(orderItem))}
                          ${this.renderCheckout()}
                      `}
            </div>
        `;
    }
}
