import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { OrderItem } from "@shared/types/OrderItem";
import { UserService } from "../services/UserService";

@customElement("cart-page")
export class CartPage extends LitElement {
    @property({ type: Object }) public productData!: OrderItem;
    @property({ type: Boolean }) private _isLoggedIn: boolean = false;
    @property({ type: Number }) public cartItemsCount: number = 0;


    private userService: UserService = new UserService();

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



    public setLoggedInStatus(isLoggedIn: boolean): void {
        this._isLoggedIn = isLoggedIn;
    }

    

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public render() {
        return html`
        <div class="cart-body">
            <div class="my-cart-title">
            My Cart:
            </div>
            <div class="product-box">
            <div class="game-cart-item">
                <div class="game-info">
                    <div class="game-cart-image">
                        <div class="badge">New</div>
                        <img src="">
                    </div>
                    <div class="game-description-text">
                        <p class="game-title">GAME 1</p>
                        <p class="game-description">Lorem ipsum dolor sit amet, vel quis magna et quos internos ut minima fugit...</p>
                    </div>
                </div>
                <div class="game-amount">
                    <div class="game-price-quantity">
                        <div class="quantity-control">
                            <button class="remove-btn">
                                <img src="/assets/img/trash.png">
                            </button>
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">3</span>
                            <button class="quantity-btn plus">+</button>
                    </div>
                    </div>
                    <span class="game-price">€20.00</span>
                </div>
            </div>
            </div>
            <div class="checkout-box">
                <button class="checkout-button">Checkout</button>
                <div class="total-price">Total: €20.00</div>
            </div>
        </div>

        `;
        
    }
    
    }