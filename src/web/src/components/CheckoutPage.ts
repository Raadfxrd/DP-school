import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { TemplateResult } from "lit";
import { CartItem } from "@shared/types";

@customElement("checkout-page")
export class CheckoutPage extends LitElement {
    @property({ type: Object }) public productData!: CartItem;
    private _userService: UserService = new UserService();

    @property({ type: Number }) public cartItemsCount: number = 1;

    private _date: string = "";
    private _gender: string = "";
    private _street: string = "";
    private _housenumber: string = "";
    private _country: string = "";

    public static styles = css`
        .login-container {
            max-width: 360px;
            margin: auto;
            margin-top: 50px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .login-container input {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid rgb(204, 204, 204);
            border-radius: 8px;
            box-sizing: border-box;
        }

        .login-container h1 {
            font-size: 2vw;
        }

        .login-container h2 {
            font-size: 0.9vw;
        }
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

    public load(): any {
        return this.render();
    }

    private renderInputFields(): TemplateResult {
        return html`
        
         <div class="login-container">
         <h1>Enter Shipping Information:</h1>
                <form id="registerForm" class="login-form"  @submit=${this.checkoutForm}>

                    <div class="login-container">
                        <h2>Date of birth:</h2>
                        <input
                            type="date"
                            id="name"
                            name="name"
                            placeholder="Date of birth "
                            @change=${this.onChangeDate}
                            value=${this._date}
                            required
                        />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="What is your gender?"
                            @change=${this.onChangeGender}
                            value=${this._gender}
                            required
                        />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your street"
                            @change=${this.onChangeStreet}
                            value=${this._street}
                            required
                        />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your housenumber"
                            @change=${this.onChangeHouseNumber}
                            value=${this._housenumber}
                            required
                        />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your country"
                            @change=${this.onChangeCountry}
                            value=${this._country}
                            required
                        />
                        <button type="submit" class="checkout-button" >Checkout</button>
                    </div>
    </form>

              </p>
                </form>
        </div>
        `;
    }

    public renderMyCartText(): TemplateResult {
        return html` <div class="my-cart-title">Checkout</div>`;
    }

    // Root.navigateToPage(RouterPage.Cart);

    private async checkoutForm(event: Event): Promise<void> {
        event.preventDefault();
        console.log("Submitting checkout...");

        if (!this._date || !this._gender || !this._street || !this._housenumber || !this._country) {
            alert("Please fill out all fields.");
            return;
        }
        const result: boolean = await this._userService.checkout({
            date: this._date,
            gender: this._gender,
            street: this._street,
            housenumber: this._housenumber,
            country: this._country,
        });

        if (result) {
            alert("Successfully Checked Out!");
            window.location.reload();
        } else {
            alert("Failed to Checkout!");
        }
    }

    public render(): TemplateResult {
        return html`
            <div class="cart-body">${html` ${this.renderMyCartText()} ${this.renderInputFields()} `}</div>
        `;
    }

    private onChangeDate(event: InputEvent): void {
        this._date = (event.target as HTMLInputElement).value;
    }

    private onChangeGender(event: InputEvent): void {
        this._gender = (event.target as HTMLInputElement).value;
    }

    private onChangeStreet(event: InputEvent): void {
        this._street = (event.target as HTMLInputElement).value;
    }

    private onChangeHouseNumber(event: InputEvent): void {
        this._housenumber = (event.target as HTMLInputElement).value;
    }

    private onChangeCountry(event: InputEvent): void {
        this._country = (event.target as HTMLInputElement).value;
    }
}
