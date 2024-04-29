/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { ProductPage } from "./ProductPage";

/** Enumeration to keep track of all the different pages */
enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
    Games = "games",
    Merchandise = "merchandise",
    News = "news",
    Account = "account",
    Product = "product", // Nieuwse route voor de productpagina

}
declare global {
    interface HTMLElementTagNameMap {
        "product-page": ProductPage;
    }
}
/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class Root extends LitElement {
    [x: string]: unknown;
    public static styles = css`
        header {
            background-color: #fbfbfa;
            padding: 10px;
        }

        main {
            padding: 10px;
            margin-left: 30px;
            margin-right: 30px;
        }

        footer {
            background-color: #c4aad0;
            padding: 10px;
            text-align: center;
        }

        nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
        }

        nav .logo img {
            width: auto;
            height: 100px;
            cursor: pointer;
        }

        nav button {
            text-decoration: none;
            background-color: #fbfbfa;
            border: none;
            padding: 0px;
            font-size: 1.5rem;
            cursor: pointer;
            font-family: "Rubik Mono One", monospace;
            letter-spacing: -1px;
            position: relative;
            overflow: hidden;
        }

        nav button::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 3px;
            background-color: #c4aad0;
            transition: width 0.3s ease;
        }

        nav button:hover::after {
            width: 100%;
        }

        .nav-left,
        .nav-right {
            display: flex;
            justify-content: space-around;
            width: 45%;
        }

        .dropdown-content {
            position: absolute;
            width: 100%;
            top: 100%;
            left: 0;
            background-color: #fbfbfa;
            display: flex;
            justify-content: space-around;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .dropdown-content.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0px);
        }

        .dropdown-section {
            flex-grow: 1;
            text-align: center;
            padding: 15px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .dropdown-section button {
            background: none;
            border: none;
            padding: 5px;
            font-size: 1rem;
            cursor: pointer;
            text-align: center;
            outline: none;
            position: relative;
            display: inline-block;
        }

        .dropdown-section button span {
            position: relative;
            display: inline-block; /* Inline-block so it wraps the content */
        }

        .dropdown-section button span::after {
            content: "";
            display: block;
            width: 0;
            height: 2px;
            background: #c4aad0;
            transition: width 0.3s ease;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            bottom: -5px;
        }

        .dropdown-section button:hover span::after {
            width: 100%;
        }

        .order-items {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
            gap: 50px;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .order-item {
            border: 3px solid #c4aad0;
            padding: 20px;
            padding-top: 0px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .order-item .text-content {
            align-self: stretch;
            text-align: center;
        }

        .order-item .product-price {
            margin-top: 20px;
            align-self: flex-end;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .order-item img {
            width: 450px;
            height: auto;
            max-width: 100%;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form label {
            display: block;
            margin-bottom: 5px;
        }
    `;

    @state()
    private _currentPage: RouterPage = RouterPage.Home;

    @state()
    private _showProductsDropdown: boolean = false;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _orderItems: OrderItem[] = [];

    @state()
    public _cartItemsCount: number = 0;

    private _userService: UserService = new UserService();
    private _orderItemService: OrderItemService = new OrderItemService();
    private _tokenService: TokenService = new TokenService();

    private _email: string = "";
    private _password: string = "";
    private _name: string = "";

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getWelcome();
        await this.getOrderItems();
    }

    /**
     * Check if the current token is valid and update the cart item total
     */
    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            this._cartItemsCount = result.cartItems?.length || 0;
        }
    }

    /**
     * Get all available order items
     */
    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    /**
     * Handler for the login form
     */
    private async submitLoginForm(): Promise<void> {
        // TODO: Validation

        const result: boolean = await this._userService.login({
            email: this._email,
            password: this._password,
        });

        if (result) {
            alert("Succesfully logged in!");

            await this.getWelcome();

            this._currentPage = RouterPage.Home;
        } else {
            alert("Failed to login!");
        }
    }

    /**
     * Handler for the register form
     */
    private async submitRegisterForm(): Promise<void> {
        // TODO: Validation

        const result: boolean = await this._userService.register({
            email: this._email,
            password: this._password,
            name: this._name,
        });

        if (result) {
            alert("Succesfully registered!");

            this._currentPage = RouterPage.Login;
        } else {
            alert("Failed to register!");
        }
    }

    /**
     * Handler for the cart button
     */
    private async clickCartButton(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (!result) {
            return;
        }

        this._cartItemsCount = result.cartItems?.length || 0;

        alert(
            `Hello ${result.email}!\r\n\r\nYou have the following products in your cart:\r\n- ${
                result.cartItems?.join("\r\n- ") || "None"
            }`
        );
    }

    /**
     * Toggle the products dropdown in the navigation
     */
    private toggleProductsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this._showProductsDropdown = !this._showProductsDropdown;
        this.requestUpdate();
    }

    /**
     * Navigate to a specific page
     *
     * @param page Page to navigate to
     */
    private navigateToPage(page: RouterPage, event: MouseEvent): void {
        event.stopPropagation(); // Prevents the click from being registered on underlying or parent elements
        this._currentPage = page;
        this._showProductsDropdown = false; // Close dropdown after selection
        this.requestUpdate(); // Ensure the component re-renders
    }

    /**
     * Handler for the logout button
     */
    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();

        this._tokenService.removeToken();

        this._isLoggedIn = false;
    }

    /**
     * Handler for the "Add to cart"-button
     *
     * @param orderItem Order item to add to the cart
     */
    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        const result: number | undefined = await this._userService.addOrderItemToCart(orderItem.id);

        if (!result) {
            return;
        }

        this._cartItemsCount = result;
    }

    /**
     * Renders the components
     */
    protected render(): TemplateResult {
        let contentTemplate: TemplateResult;

        switch (this._currentPage) {
            case RouterPage.Login:
                contentTemplate = this.renderLogin();
                break;
            case RouterPage.Register:
                contentTemplate = this.renderRegister();
                break;

            case RouterPage.Product:
                 contentTemplate = html`<product-page .productData=${this.selectedProduct}></product-page>`;
                 break;
            default:
                contentTemplate = this.renderHome();
            

        }

    

        return html`
            <header>
                <nav>
                    <div class="nav-left">
                        ${this.renderProductsInNav()} ${this.renderNewsInNav()} ${this.renderAccountInNav()}
                    </div>
                    <div
                        class="logo"
                        @click=${(): void => {
                            this._currentPage = RouterPage.Home;
                        }}
                    >
                        <img src="/assets/img/logo.png" alt="Logo" />
                    </div>
                    <div class="nav-right">
                        ${this.renderSearchInNav()} ${this.renderLoginInNav()} ${this.renderRegisterInNav()}
                        ${this.renderCartInNav()} ${this.renderLogoutInNav()}
                    </div>
                </nav>
            </header>
            <main>${contentTemplate}</main>
            <footer>Copyright &copy; Don't Play</footer>
        `;
    }

    /**
     * Renders the home page, which contains a list of all order items.
     */
    private renderHome(): TemplateResult {
        const orderItems: TemplateResult[] = this._orderItems.map((e) => this.renderOrderItem(e));

        if (orderItems.length === 0) {
            return html`<div class="order-items">Loading... Please wait a moment.</div> `;
        }

        return html` <div class="order-items">${orderItems}</div> `;
    }

    /**
     * Renders a single order item
     *
     * @param orderItem Order item to render
     */
    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
            <div class="order-item">
                <div class="text-content">
                    <h2>${orderItem.name}</h2>
                    <p>${orderItem.description}</p>
                </div>
                <img src="${orderItem.imageURLs}" alt="${orderItem.name}" />
                <p class="product-price">Price: €${orderItem.price}</p>
                <button @click=${() => this.navigateToProductPage(orderItem)}>View Details</button>
                ${this._isLoggedIn
                    ? html`<button @click=${async (): Promise<void> => await this.addItemToCart(orderItem)}>
                          Add to cart
                      </button>`
                    : nothing}
            </div>
        `;
    }

private navigateToProductPage(product: any): void {
    this.selectedProduct = product; // Sla de geselecteerde productgegevens op
    this._currentPage = RouterPage.Product; // Navigeer naar de productpagina
}

    
    /**
     * Renders the products button in the navigation
     */
    private renderProductsInNav(): TemplateResult {
        return html`
            <div @click=${this.toggleProductsDropdown}>
                <button>Products</button>
                <div class=${this._showProductsDropdown ? "dropdown-content visible" : "dropdown-content"}>
                    <div class="dropdown-section">
                        <button @click=${(e: MouseEvent): void => this.navigateToPage(RouterPage.Games, e)}>
                            Games
                        </button>
                    </div>
                    <div class="dropdown-section">
                        <button
                            @click=${(e: MouseEvent): void => this.navigateToPage(RouterPage.Merchandise, e)}
                        >
                            Merchandise
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renders the news button in the navigation
     */

    private renderNewsInNav(): TemplateResult {
        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Home;
            }}
        >
            <button>News</button>
        </div>`;
    }

    /**
     * Renders the account button in the navigation
     */
    private renderAccountInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Home;
            }}
        >
            <button>Account</button>
        </div>`;
    }

    /**
     * Renders the search button in the navigation
     */
    private renderSearchInNav(): TemplateResult {
        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Home;
            }}
        >
            <button>Search</button>
        </div>`;
    }

    /**
     * Renders the cart button in the navigation
     */
    private renderCartInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div @click=${this.clickCartButton}>
            <button>Cart (${this._cartItemsCount} products)</button>
        </div>`;
    }

    /**
     * Renders the login button in the navigation
     */
    private renderLoginInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Login;
            }}
        >
            <button>Login</button>
        </div>`;
    }

    /**
     * Renders the register button in the navigation
     */
    private renderRegisterInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html` <div
            @click=${(): void => {
                this._currentPage = RouterPage.Register;
            }}
        >
            <button>Register</button>
        </div>`;
    }

    /**
     * Renders the logout button in the navigation
     */
    private renderLogoutInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`
            <div @click=${this.clickLogoutButton}>
                <button>Logout</button>
            </div>
        `;
    }

    /** Here will all the functionalities for the login and register pages follow **/

    /**
     * Renders the login page
     */
    private renderLogin(): TemplateResult {
        return html`
            <div class="form">
                ${this.renderEmail()} ${this.renderPassword()}

                <div>
                    <button @click="${this.submitLoginForm}" type="submit">Login</button>
                </div>

                <div>
                    Of
                    <button
                        @click="${(): void => {
                            this._currentPage = RouterPage.Register;
                        }}"
                    >
                        Register
                    </button>
                    by clicking here
                </div>
            </div>
        `;
    }

    /**
     * Renders the register page
     */
    private renderRegister(): TemplateResult {
        return html`
            <div class="form">
                <div>
                    <label for="username">Name</label>
                    <input type="text" id="name" value=${this._name} @change=${this.onChangeName} />
                </div>

                ${this.renderEmail()} ${this.renderPassword()}

                <div>
                    <button @click="${this.submitRegisterForm}" type="submit">Register</button>
                </div>

                <div>
                    Of
                    <button
                        @click="${(): void => {
                            this._currentPage = RouterPage.Login;
                        }}"
                    >
                        Login
                    </button>
                    by clicking here
                </div>
            </div>
        `;
    }

    /**
     * Renders the e-mail input field with change-tracking
     */
    private renderEmail(): TemplateResult {
        return html`<div>
            <label for="email">E-mail</label>
            <input
                type="text"
                name="email"
                placeholder="test@test.nl"
                value=${this._email}
                @change=${this.onChangeEmail}
            />
        </div>`;
    }

    /**
     * Renders the password input field with change-tracking
     */
    private renderPassword(): TemplateResult {
        return html`<div>
            <label for="password">Password</label>
            <input type="password" value=${this._password} @change=${this.onChangePassword} />
        </div>`;
    }

    /**
     * Handles changes to the e-mail input field
     */
    private onChangeEmail(event: InputEvent): void {
        this._email = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the password input field
     */
    private onChangePassword(event: InputEvent): void {
        this._password = (event.target as HTMLInputElement).value;
    }

    /**
     * Handles changes to the name input field
     */
    private onChangeName(event: InputEvent): void {
        this._name = (event.target as HTMLInputElement).value;
    }
}
