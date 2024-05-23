import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { TemplateResult } from "lit";

@customElement("cart-page")
export class CartPage extends LitElement {
    @property({ type: Object }) public productData!: OrderItem;
    @property({ type: Boolean }) private _isLoggedIn: boolean = false;
    @property({ type: Number }) public cartItemsCount: number = 0;

    @state() private _cartItemsArray: OrderItem[] = [];
    private userService: UserService = new UserService();
    private _tokenService: TokenService = new TokenService();
    private orderItemService: OrderItemService = new OrderItemService();

    
    public static styles = css`

    .cart-body{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .my-cart-title{        
        text-decoration: none;
        background-color: #fbfbfa;
        padding: 0px;
        font-size: 1.5rem;
        font-family: "Rubik Mono One", monospace;
        letter-spacing: -1px;
    }

    .game-cart-image{
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
    background-color: #F0F0F0;
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

    .game-description-text{
        display: flex;
        flex-direction: column;
    }

    .game-amount{
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

    .remove-btn img{
        height: 13px
    }


    .checkout-box{
        display: flex;
        flex-direction: row;
        align-items: center
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

.total-price{
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
}


private async loadCartItems(): Promise<void> {
    const orderItems: any = await this.orderItemService.getAll();
    if (orderItems) {
        this._cartItemsArray = orderItems;
        this.cartItemsCount = orderItems.length;
    }
}

    public load(): any{
        if(this._cartItemsArray === null){
            console.log(this._cartItemsArray);
            return;
        }
        
    }



    public setLoggedInStatus(isLoggedIn: boolean): void {
        this._isLoggedIn = isLoggedIn;
    }


    


    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

        private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
            <div class="product-box">
            <div class="game-cart-item">
                <div class="game-info">
                    <div class="game-cart-image">
                        <div class="badge">New</div>
                        <img src="">
                    </div>
                    <div class="game-description-text">
                        <p class="game-title">${orderItem.name}</p>
                        <p class="game-description">${orderItem.description}</p>
                    </div>
                </div>
                <div class="game-amount">
                    <div class="game-price-quantity">
                        <div class="quantity-control">
                            <button class="remove-btn">
                                <img src="/assets/img/trash.png">
                            </button>
                            <button class="quantity-btn minus" @click=${(): void => this.quantityCalculator(orderItem.id, -1)}> - </button>
                            <span class="quantity" >${orderItem.quantity}</span>
                            <button class="quantity-btn plus" @click=${(): void => this.quantityCalculator(orderItem.id, 1)}> + </button>
                    </div>
                    </div>
                    <span class="game-price">${orderItem.price}</span>
                </div>
            </div>
            </div>

        `;
        
    }
    
    private quantityCalculator(itemId: number, change: number): void {
        const updatedItems: OrderItem[] = this._cartItemsArray.map((item) => {
            if (item.id === itemId) {
                const newQuantity : number = Math.max(item.quantity + change, 1);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        this._cartItemsArray = updatedItems;
    }



    private calculateTotalPrice(): number {
        return this._cartItemsArray.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    public renderMyCartText(): TemplateResult{
        return html`
        <div class="my-cart-title">
        My Cart:
        </div>`;
    }

    public renderCheckout(): TemplateResult{
        return html`
        <div class="checkout-box">
                <button class="checkout-button">Checkout</button>
                <div class="total-price">Total:> €${this.calculateTotalPrice()}</div>
            </div>`;
    }

    public render(): TemplateResult {
        console.log(this.userService.getItemFromCart());
        return html`
          <div class="cart-body">
            ${this._cartItemsArray.length === 0
              ? html`<div>Loading... Please wait a moment.</div>`
              : html`
                ${this.renderMyCartText()}
                ${this._cartItemsArray.map(item => this.renderOrderItem(item))}
                ${this.renderCheckout()}
              `}
          </div>
        `;
      }
    
    }