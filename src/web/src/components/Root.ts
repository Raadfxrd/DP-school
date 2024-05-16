import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

/** Enumeration to keep track of all the different pages */
enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
    Games = "games",
    Merchandise = "merchandise",
    News = "news",
    Account = "account",
}

/**
 * Custom element based on Lit for the header of the webshop.
 *
 * @todo Most of the logic in this component is over-simplified. You will have to replace most of if with actual implementions.
 */
@customElement("webshop-root")
export class Root extends LitElement {
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
            width: 25%;
            top: 100%;
            left: 0;
            background-color: #fbfbfa;
            display: flex;
            justify-content: space-around;
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

        .login-container {
            max-width: 360px; /* Iets breder voor betere leesbaarheid */
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .login-form h1 {
            color: #5a4e7c; /* Donkere paarse kleur voor de kop */
            text-align: center;
            margin-bottom: 20px;
        }

        .login-form label {
            display: block;
            margin-bottom: 10px;
            color: #5a4e7c; /* Tekstkleur */
        }

        .login-form input {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-sizing: border-box; /* Voorkomt problemen met padding en breedte */
        }

        .login-form button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 8px;
            background-color: #957dad; /* Zachtere paarse tint */
            color: white;
            font-size: 1.1em;
            cursor: pointer;
        }

        .login-form button:hover {
            background-color: #5a4e7c; /* Donkerdere paars voor hover effect */
        }

        .login-form .message {
            text-align: center;
            margin-top: 20px;
        }

        .login-form .message a {
            color: #957dad; /* Link kleur */
            text-decoration: none;
        }

        .login-form .message a:hover {
            text-decoration: underline;
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

    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            this._cartItemsCount = result.cartItems?.length || 0;
        }
    }

    private async getOrderItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();

        if (!result) {
            return;
        }

        this._orderItems = result;
    }

    private async submitLoginForm(event: Event): Promise<void> {
        event.preventDefault();

        if (!this._email || !this._password) {
            alert("Please fill out all fields.");
            return;
        }

        const result: boolean = await this._userService.login({
            email: this._email,
            password: this._password,
        });

        if (result) {
            alert("Successfully logged in!");
            await this.getWelcome();
            this._currentPage = RouterPage.Home;
        } else {
            alert("Failed to login!");
        }
    }

    private async submitRegisterForm(event: Event): Promise<void> {
        event.preventDefault();
        console.log("Submitting registration form...");
        console.log(`Name: ${this._name}, Email: ${this._email}, Password: ${this._password}`);

        if (!this._name || !this._email || !this._password) {
            alert("Please fill out all fields.");
            return;
        }

        const result: boolean = await this._userService.register({
            email: this._email,
            password: this._password,
            name: this._name,
        });

        if (result) {
            alert("Successfully registered!");
            this._currentPage = RouterPage.Login;
        } else {
            alert("Failed to register!");
        }
    }

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

    private toggleProductsDropdown(e: MouseEvent): void {
        e.preventDefault();
        this._showProductsDropdown = !this._showProductsDropdown;
        this.requestUpdate();
    }

    private navigateToPage(page: RouterPage, event: MouseEvent): void {
        event.stopPropagation();
        this._currentPage = page;
        this._showProductsDropdown = false;
        this.requestUpdate();
    }

    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();
        this._tokenService.removeToken();
        this._isLoggedIn = false;
    }

    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        const result: number | undefined = await this._userService.addOrderItemToCart(orderItem.id);

        if (!result) {
            return;
        }

        this._cartItemsCount = result;
    }

    protected render(): TemplateResult {
        let contentTemplate: TemplateResult;

        switch (this._currentPage) {
            case RouterPage.Login:
                contentTemplate = this.renderLogin();
                break;
            case RouterPage.Register:
                contentTemplate = this.renderRegister();
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

    private renderHome(): TemplateResult {
        const orderItems: TemplateResult[] = this._orderItems.map((e) => this.renderOrderItem(e));

        if (orderItems.length === 0) {
            return html`<div class="order-items">Loading... Please wait a moment.</div>`;
        }

        return html` <div class="order-items">${orderItems}</div> `;
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        return html`
            <div class="order-item">
                <div class="text-content">
                    <h2>${orderItem.name}</h2>
                    <p>${orderItem.description}</p>
                </div>
                <img src="${orderItem.imageURLs}" alt="${orderItem.name}" />
                <p class="product-price">Price: €${orderItem.price}</p>
                ${this._isLoggedIn
                    ? html`<button @click=${async (): Promise<void> => await this.addItemToCart(orderItem)}>
                          Add to cart
                      </button>`
                    : nothing}
            </div>
        `;
    }

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

    private renderNewsInNav(): TemplateResult {
        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.News;
            }}
        >
            <button>News</button>
        </div>`;
    }

    private renderAccountInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Account;
            }}
        >
            <button>Account</button>
        </div>`;
    }

    private renderSearchInNav(): TemplateResult {
        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Home;
            }}
        >
            <button>Search</button>
        </div>`;
    }

    private renderCartInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div @click=${this.clickCartButton}>
            <button>Cart (${this._cartItemsCount} products)</button>
        </div>`;
    }

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

    private renderRegisterInNav(): TemplateResult {
        if (this._isLoggedIn) {
            return html``;
        }

        return html`<div
            @click=${(): void => {
                this._currentPage = RouterPage.Register;
            }}
        >
            <button>Register</button>
        </div>`;
    }

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

    private renderLogin(): TemplateResult {
        return html`
            <div class="login-container">
                <form id="loginForm" class="login-form" @submit=${this.submitLoginForm}>
                    <h1>Inloggen</h1>
                    ${this.renderEmail()} ${this.renderPassword()}
                    <div>
                        <button type="submit">Login</button>
                    </div>
                    <p class="message">
                        No Account?
                        <a
                            @click="${(): void => {
                                this._currentPage = RouterPage.Register;
                                this.requestUpdate();
                            }}"
                            >Create an account</a
                        >
                    </p>
                </form>
            </div>
        `;
    }

    private renderRegister(): TemplateResult {
        return html`
            <div class="login-container">
                <form id="registerForm" class="login-form" @submit=${this.submitRegisterForm}>
                    <h1>Register</h1>

                    <!-- Name field -->
                    <div>
                        <label for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value=${this._name}
                            @change=${this.onChangeName}
                            required
                        />
                    </div>

                    <!-- Email field -->
                    ${this.renderEmail()}

                    <!-- Password field -->
                    ${this.renderPassword()}

                    <!-- Register button -->
                    <div>
                        <button type="submit">Register</button>
                    </div>

                    <!-- Link to login page -->
                    <p class="message">
                        Already have an account?
                        <a
                            @click="${(): void => {
                                this._currentPage = RouterPage.Login;
                                this.requestUpdate();
                            }}"
                            >Log in</a
                        >
                    </p>
                </form>
            </div>
        `;
    }

    private renderEmail(): TemplateResult {
        return html`
            <div>
                <label for="email">E-mail</label>
                <input
                    type="text"
                    name="email"
                    placeholder="test@test.nl"
                    value=${this._email}
                    @change=${this.onChangeEmail}
                    required
                />
            </div>
        `;
    }

    private renderPassword(): TemplateResult {
        return html`
            <div>
                <label for="password">Password</label>
                <input type="password" value=${this._password} @change=${this.onChangePassword} required />
            </div>
        `;
    }

    private onChangeEmail(event: InputEvent): void {
        this._email = (event.target as HTMLInputElement).value;
    }

    private onChangePassword(event: InputEvent): void {
        this._password = (event.target as HTMLInputElement).value;
    }

    private onChangeName(event: InputEvent): void {
        this._name = (event.target as HTMLInputElement).value;
    }
}
