import { LitElement, PropertyValues, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserService } from "../services/UserService";
import { OrderItem } from "@shared/types/OrderItem";
import { TokenService } from "../services/TokenService";
import { OrderItemService } from "../services/OrderItemService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserData } from "@shared/types/UserData";
import { ProductPage } from "./ProductPage";
import { CartPage } from "./CartPage";
import { AdminPage } from "./AdminPage";
import "./GamesPage";
import "./MerchandisePage";
import { CartItem } from "@shared/types";
import { CheckoutPage } from "./CheckoutPage";

export enum RouterPage {
    Home = "orderItems",
    Login = "login",
    Register = "register",
    Games = "games",
    Merchandise = "merchandise",
    News = "news",
    Account = "account",
    Admin = "admin",
    Product = "product",
    Cart = "cart",
    Checkout = "checkout",
    SearchResults = "searchResults",
    
}

declare global {
    interface HTMLElementTagNameMap {
        "product-page": ProductPage;
        "cart-page": CartPage;
        "admin-page": AdminPage;
        "checkout-page": CheckoutPage;
    }
}

@customElement("webshop-root")
export class Root extends LitElement {
    public static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 100vh;
        }

        header {
            background-color: #fbfbfa;
            padding: 10px;
        }

        main {
            padding: 10px;
            margin-left: 30px;
            margin-right: 30px;
            flex: 1 0 auto;
            z-index: 0;
        }

        nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
            background-color: white;
        }

        nav .logo img {
            width: auto;
            height: 100px;
            cursor: pointer;
        }

        .cartimg {
            width: 75px;
            height: 75px;
            padding: 0;
            border: none;
            z-index: 100;
            position: absolute;
            right: 0px;
        }

        .cartbutton {
            position: fixed;
            width: auto;
            height: 75px;
            bottom: 5%;
            right: 3%;
            justify-content: center;
            align-items: center;
            z-index: 99;
        }

        .cartbuttondesign {
            cursor: pointer;
            padding: none;
            border: none;
            border-radius: 50%;
            background: transparent;
            z-index: 100;
        }

        nav button {
            text-decoration: none;
            background-color: #fff;
            border: none;
            padding: 0px;
            font-size: 1.5rem;
            cursor: pointer;
            font-family: "Rubik Mono One", monospace;
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

        .search-login-container {
            display: flex;
            justify-content: space-between;
            width: 140px;
        }

        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            padding-top: 10px;
            display: none;
            position: absolute;
            background-color: white;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 1;
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }

        .dropdown-section {
            text-align: center;
            padding: 12px 16px;
        }

        .dropdown-section button {
            background: none;
            border: none;
            padding: 5px;
            font-size: 1rem;
            cursor: pointer;
            text-align: center;
            outline: none;
        }

        .search-container {
            position: relative;
        }

        .searchbar {
            opacity: 0;
            width: 0;
            transition: width 0.3s;
            font-family: "Rubik Mono One", monospace;
            font-size: 1.5rem;
            border: none;
            outline: none;
        }

        .searchbar.show {
            opacity: 1;
            width: 150px;
            animation: showSearchBar 0.3s forwards;
        }

        .searchbar.hide {
            opacity: 0;
            width: 0;
            animation: hideSearchBar 0.3s forwards;
        }

        .searchbar input {
            font-family: "Rubik Mono One", monospace;
            font-size: 1.5rem;
            border: none;
            outline: none;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        .searchbar input::placeholder {
            color: #000000;
        }

        .searchbar input:focus {
            border-bottom: 3px solid #c4aad0;
        }

        .highlighted {
            margin: 0px;
            padding: 0px;
        }

        .highlighted-games-carousel {
            display: flex;
            position: relative;
            margin: 0;
            z-index: 0;
        }

        .carousel-inner {
            display: inline-block;
            display: flex;
            justify-content: center;
            transition: opacity 0.5s ease-in-out;
            scroll-behavior: smooth;
            width: 200%;
        }

        .carousel-inner > * {
            width: 100%;
            flex-shrink: 0;
        }

        .carousel-buttons {
            flex-shrink: 0;
        }

        .highlighted-game {
            flex: 0 0 auto;
            scroll-snap-align: start;
            position: relative;
            padding: 50px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            height: 90vh;
            width: 95%;
            box-sizing: border-box;
            transition: transform 0.3s ease;
        }

        .highlighted-game img {
            width: 500px;
            min-height: 500px;
        }

        .highlighted-game .product-price {
            margin-top: 20px;
            align-self: flex-end;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .highlighted-game:hover {
            transform: scale(1.05);
        }

        .game-details {
            padding: 16px;
            width: 100%;
            height: 100%;
        }

        .game-details h2 {
            margin: 0;
            font-size: 2rem;
        }

        .game-details p {
            font-size: 1.5rem;
            color: #666;
            height: 100px;
            text-align: justify;
        }

        .game-details .details,
        .game-details .addItemToCart {
            background-color: #c4aad0;
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .game-details .details:hover,
        .game-details .addItemToCart:hover {
            background-color: #a883b8;
        }

        .badge {
            position: absolute;
            top: 10px;
            left: 0px;
            padding: 10px 30px;
            background-color: #c4aad0;
            color: #000;
            font-weight: bold;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            transition: border 1s ease;
        }

        .order-items {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
            gap: 50px;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .order-item {
            padding: 20px;
            padding-top: 0px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            height: 700px;
        }

        .order-item img {
            width: 450px;
            height: 450px;
            max-width: 100%;
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

        .addItemToCart {
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

        .addItemToCart:hover {
            background-color: #8e7996;
        }

        .addItemToCart:focus {
            outline: none;
        }

        .addItemToCart:active {
            transform: translateY(1px);
        }

        .cartcount {
            color: white;
            height: 20px;
            width: 20px;
            background-color: red;
            border-radius: 50%;
            display: flex;
            margin-bottom: 10px;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            position: absolute;
        }

        .details {
            display: inline-block;
            min-width: 100%;
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

        .details:hover {
            background-color: #8e7996;
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
            max-width: 360px;
            margin: auto;
            margin-top: 150px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .login-form h1 {
            color: #5a4e7c;
            text-align: center;
            margin-bottom: 20px;
        }

        .login-form label {
            display: block;
            margin-bottom: 10px;
            color: #5a4e7c;
        }

        .login-form input {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-sizing: border-box;
        }

        .login-form button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 8px;
            background-color: #957dad;
            color: white;
            font-size: 1.1em;
            cursor: pointer;
        }

        .login-form button:hover {
            background-color: #5a4e7c;
        }

        .login-form .message {
            text-align: center;
            margin-top: 20px;
        }

        .login-form .message a {
            color: #957dad;
            text-decoration: none;
        }

        .login-form .message a:hover {
            text-decoration: underline;
        }

        footer {
            display: flex;
            justify-content: space-around;
            background-color: #c4aad0;
            padding: 20px;
            font-family: "Rubik", sans-serif;
            flex-shrink: 0;
        }

        .sitemap,
        .social-media {
            margin-bottom: 20px;
            margin-right: 10px;
        }

        .social-media {
            margin-right: 0;
        }

        .sitemap h3,
        .social-media h3 {
            text-align: center;
            font-family: "Rubik Mono One", monospace;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        .sitemap ul,
        .social-media ul {
            display: flex;
            flex-wrap: wrap;
            padding: 0;
        }

        .sitemap ul li {
            list-style: none;
            flex: 1 0 50%;
            width: 80%;
            margin: 0 auto;
            text-align: center;
        }

        .sitemap ul li a,
        .social-media ul li a {
            color: #000;
            text-decoration: none;
            border: none;
            padding: 0px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            color: #000;
            line-height: 1.3;
        }

        .sitemap ul li a::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 1px;
            background-color: #000;
            transition: width 0.3s ease;
        }

        .sitemap ul li a:hover::after {
            width: 100%;
        }

        .social-media ul li {
            display: inline-block;
            margin-right: 10px;
        }

        .social-media ul li a {
            font-size: 20px;
        }

        .icon {
            width: 2rem;
            height: 2rem;
            vertical-align: -0.125em;
            transition: filter 0.3s ease;
        }

        .icon:hover {
            filter: brightness(0) invert(1);
        }

        .news-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .news-item {
            border: 2px solid #5a4e7c;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            background-color: #fff;
        }

        .news-item:hover {
            background-color: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .news-item h3 {
            margin: 0 0 10px 0;
            color: #5a4e7c;
            font-size: 1.2em;
        }

        .news-item p {
            margin: 0;
            color: #333;
            font-size: 1em;
        }

        .news-item.empty {
            background-color: #eee;
            text-align: center;
            color: #888;
            border: 2px dashed #5a4e7c;
        }

        .news-content {
            display: none;
        }

        .news-item.expanded .news-content {
            display: block;
        }

        .profile-container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .profile-container h2 {
            color: #5a4e7c;
            text-align: center;
        }

        .profile-item {
            margin: 10px 0;
        }

        .profile-item span {
            font-weight: bold;
        }

        @keyframes showSearchBar {
            from {
                opacity: 0;
                width: 0;
            }
            to {
                opacity: 1;
                width: 150px;
            }
        }

        @keyframes hideSearchBar {
            from {
                opacity: 1;
                width: 150px;
            }
            to {
                opacity: 0;
                width: 0;
            }
        }
    `;

    @state()
    private _currentPage: RouterPage = RouterPage.Home;

    @state()
    private _searchQuery: string = "";

    @state()
    private _searchResults: OrderItem[] = [];

    @state()
    private _showSearchBar: boolean = false;

    @state()
    private _isLoggedIn: boolean = false;

    @state()
    private _OrderItem: OrderItem[] = [];


    @state()
    private _loadingOrderItems: boolean = true;

    @state()
    private _cartItemsCount: number = 0;
    
    @state()
    private _cartItem: CartItem[] | undefined = [];
    

    @state()
    private selectedProduct: OrderItem | undefined = undefined;

    @state()
    private _newsItems: { title: string; content: string; expanded: boolean }[] = [];

    @state()
    private _userProfile?: UserData;



    @state()
    private autoSlideInterval: any;

    @state()
    private currentGameIndex: number = 0;

    @state()
    private isHovering: boolean = false;

    @state()
    private isAutoSlideStopped: boolean = false;

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
        this.startAutoSlide();
        this._newsItems = [
            {
                title: "Breaking News",
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                expanded: false,
            },
        ];
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    private async getWelcome(): Promise<void> {
        const result: UserHelloResponse | undefined = await this._userService.getWelcome();

        if (result) {
            this._isLoggedIn = true;
            this._cartItem = await this._userService.getItemFromCart();
            if(this._cartItem)
            this._cartItemsCount = this._cartItem.length;
        }
    }
    
    


    private async getOrderItems(): Promise<void> {
        this._loadingOrderItems = true;
        const result: OrderItem[] | undefined = await this._orderItemService.getAll();
        if (result) {
            this._OrderItem = result;
        }
        this._loadingOrderItems = false;
    }

    private async getUserProfile(): Promise<void> {
        const result: UserData | undefined = await this._userService.getUserProfile();

        if (result) {
            this._userProfile = result;
        }
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
        this.navigateToPage(RouterPage.Cart);
        if (!result) {
            return;
        }

        (
            `Hello ${result.email}!\r\n\r\nYou have the following products in your cart:\r\n- ${
                result.cartItems?.join("\r\n- ") || "None"
            }`
        );
    }

    private navigateToPage(page: RouterPage, query?: string, searchResults?: OrderItem[]): void {
        this._currentPage = page;
        if (page === RouterPage.Product && this.selectedProduct) {
        } else if (query) {
            this._searchQuery = query;
        }
        if (searchResults) {
            this._searchResults = searchResults;
        }
        if (page === RouterPage.Account) {
            void this.getUserProfile();
        }
        this.requestUpdate();
    }

    private async clickLogoutButton(): Promise<void> {
        await this._userService.logout();
        this._tokenService.removeToken();
        this._isLoggedIn = false;
    }





    private async addItemToCart(orderItem: OrderItem): Promise<void> {
        const productId: number = orderItem.id;
        const result: number | undefined = await this._userService.addOrderItemToCart(productId);
        this._userService.addOrderItemToCart;
        window.location.reload();
        if (!result) {
            return;
        }

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

            case RouterPage.Product:
                contentTemplate = this.selectedProduct
                    ? html`<product-page .productData=${this.selectedProduct}></product-page>`
                    : html`<p>Product not found</p>`;
                break;

            case RouterPage.Games:
                contentTemplate = html`<game-page></game-page>`;
                break;

            case RouterPage.Merchandise:
                contentTemplate = html`<merchandise-page></merchandise-page>`;
                break;

            case RouterPage.Cart:
                contentTemplate = this.renderCartPage();
                break;
            
            case RouterPage.Checkout:
                contentTemplate = this.renderCheckoutPage();
                break;

            case RouterPage.Admin:
                contentTemplate = html`<admin-page></admin-page>`;
                break;

            case RouterPage.News:
                contentTemplate = this.renderNews();
                break;

            case RouterPage.Account:
                contentTemplate = this.renderAccount();
                break;

            case RouterPage.SearchResults:
                contentTemplate = html`<search-results-page
                    .query=${this._searchQuery}
                ></search-results-page>`;
                break;

            default:
                contentTemplate = this.renderHome();
        }

        return html`
            <header>
                <nav>
                    <div class="nav-left">
                        ${this.renderProductsInNav()} ${this.renderNewsInNav()} ${this.renderAccountInNav()} ${this.renderCheckoutInNav()}
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
                        <div class="search-login-container">${this.renderSearchInNav()}</div>
                        ${this.renderLoginInNav()} ${this.renderLogoutInNav()} ${this.renderAdminButton()}
                    </div>
                </nav>
                <div class="cartbutton">${this.renderCartInNav()}</div>
            </header>
            <main>${contentTemplate}</main>
            <footer>
                <div class="sitemap">
                    <h3>Sitemap</h3>
                    <ul>
                        <li>
                            <a
                                @click=${(): void => {
                                    this._currentPage = RouterPage.Home;
                                }}
                                >Home</a
                            >
                        </li>
                        <li>
                            <a
                                @click=${(): void => {
                                    this._currentPage = RouterPage.Games;
                                }}
                                >Games</a
                            >
                        </li>
                        <li>
                            <a
                                @click=${(): void => {
                                    this._currentPage = RouterPage.Merchandise;
                                }}
                                >Merchandise</a
                            >
                        </li>
                        <li>
                            <a
                                @click=${(): void => {
                                    this._currentPage = RouterPage.News;
                                }}
                                >News</a
                            >
                        </li>
                        ${this._isLoggedIn
                            ? html`<li>
                                  <a
                                      href="#"
                                      @click=${(): void => {
                                          this._currentPage = RouterPage.Account;
                                      }}
                                      >Account</a
                                  >
                              </li>`
                            : ""}
                        <li>
                            <a
                                @click=${(): void => {
                                    this._currentPage = RouterPage.Cart;
                                }}
                                >Cart</a
                            >
                        </li>
                        <li>
                            <a
                                @click=${(): void => {
                                    this._currentPage = RouterPage.Login;
                                }}
                                >Login</a
                            >
                        </li>
                    </ul>
                </div>
                <div class="social-media">
                    <h3>Follow Us</h3>
                    <ul>
                        <ul>
                            <li>
                                <a href="https://www.facebook.com/">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
                                        ></path>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.x.com/">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z"
                                        ></path>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z"
                                        ></path>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://gitlab.fdmci.hva.nl/propedeuse-hbo-ict/onderwijs/2023-2024/out-a-se-ti/blok-4/laawaalaaguu12"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            d="M0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96zm337.5 12.5l44.6 116.4 .4 1.2c5.6 16.8 7.2 35.2 2.3 52.5c-5 17.2-15.4 32.4-29.8 43.3l-.2 .1-68.4 51.2-54.1 40.9c-.5 .2-1.1 .5-1.7 .8c-2 1-4.4 2-6.7 2c-3 0-6.8-1.8-8.3-2.8l-54.2-40.9L93.5 322.3l-.4-.3-.2-.1c-14.3-10.8-24.8-26-29.7-43.3s-4.2-35.7 2.2-52.5l.5-1.2 44.7-116.4c.9-2.3 2.5-4.3 4.5-5.6c1.6-1 3.4-1.6 5.2-1.8c1.3-.7 2.1-.4 3.4 .1c.6 .2 1.2 .5 2 .7c1 .4 1.6 .9 2.4 1.5c.6 .4 1.2 1 2.1 1.5c1.2 1.4 2.2 3 2.7 4.8l29.2 92.2H285l30.2-92.2c.5-1.8 1.4-3.4 2.6-4.8s2.8-2.4 4.5-3.1c1.7-.6 3.6-.9 5.4-.7s3.6 .8 5.2 1.8c2 1.3 3.7 3.3 4.6 5.6z"
                                        ></path>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </ul>
                </div>
            </footer>
        `;
    }

    private renderHome(): TemplateResult {
        if (this._loadingOrderItems) {
            return html`<div class="order-items">Loading... Please wait a moment.</div>`;
        }
        const orderItems: TemplateResult[] = this._OrderItem.map((e) => this.renderOrderItem(e));

        if (orderItems.length === 0) {
            return html`<div class="order-items">No items found.</div>`;
        }

        return html`
            <div class="highlighted">
                ${this.renderHighlightedGamesCarousel()}
                <div class="order-items">${orderItems}</div>
            </div>
        `;
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        const truncatedDescription: string | undefined =
            orderItem.description && orderItem.description.length > 200
                ? orderItem.description.substring(0, 200) + "..."
                : orderItem.description;

        return html`
            <div class="order-item">
                <div class="text-content">
                    <h2>${orderItem.title}</h2>
                    <p>${truncatedDescription}</p>
                </div>
                <img src="${orderItem.thumbnail}" alt="${orderItem.title}" />
                <p class="product-price">Price: €${orderItem.price}</p>
                <button class="details" @click=${(): void => this.handleDetailsClick(orderItem)}>
                    View details
                </button>
                ${this._isLoggedIn
                    ? html`<button
                          class="addItemToCart"
                          @click=${async (): Promise<void> => this.addItemToCart(orderItem)}
                      >
                          Add to cart
                      </button>`
                    : nothing}
            </div>
        `;
    }

    private handleDetailsClick(orderItem: OrderItem): void {
        this.navigateToProductPage(orderItem);
    }

    private renderHighlightedGamesCarousel(): TemplateResult {
        const highlightedGames: OrderItem[] = this._OrderItem.filter((e) => e.tags.includes("highlighted"));

        if (highlightedGames.length === 0) {
            return html`<div class="highlighted-games">No highlighted games found.</div>`;
        }

        const currentGame: OrderItem = highlightedGames[this.currentGameIndex % highlightedGames.length];

        if (!currentGame) {
            console.error("No current game found");
            return html``;
        }

        return html`
            <div class="highlighted-games-carousel">
                <div class="carousel-inner">
                    <div
                        class="highlighted-game"
                        @mouseover=${this.stopAutoSlide}
                        @mouseout=${this.startAutoSlide}
                    >
                        <div class="badge">Featured!</div>
                        <img src="${currentGame.thumbnail}" alt="${currentGame.title}" />
                        <div class="game-details">
                            <h2>${currentGame.title}</h2>
                            <p>${currentGame.description}</p>
                            <button
                                class="details"
                                @click=${(): void => this.handleDetailsClick(currentGame)}
                            >
                                View details
                            </button>
                            ${this._isLoggedIn
                                ? html`<button
                                      class="addItemToCart"
                                      @click=${async (): Promise<void> => this.addItemToCart(currentGame)}
                                  >
                                      Add to cart
                                  </button>`
                                : nothing}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    public updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (!this.autoSlideInterval && !this.isHovering && !this.isAutoSlideStopped) {
            this.startAutoSlide();
        }
    }

    private startAutoSlide(): void {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        this.isAutoSlideStopped = false;
        this.autoSlideInterval = setInterval(() => {
            this.moveCarouselRight();
        }, 5000);
    }

    private stopAutoSlide(): void {
        this.isAutoSlideStopped = true;
        clearInterval(this.autoSlideInterval);
    }

    private moveCarouselRight(): void {
        const previousGameIndex: number = this.currentGameIndex;
        this.currentGameIndex = (this.currentGameIndex + 1) % this._OrderItem.length;
        if (this.currentGameIndex !== previousGameIndex) {
            this.requestUpdate();
        }
    }

    private navigateToProductPage(orderItem: OrderItem): void {
        this._currentPage = RouterPage.Product;
        this.selectedProduct = orderItem;
        this.requestUpdate();
    }

    private constructor() {
        super();
        this.addEventListener("navigate-to-product", this.onNavigateToProduct as EventListener);
        this.startAutoSlide = this.startAutoSlide.bind(this);
        this.stopAutoSlide = this.stopAutoSlide.bind(this);
    }

    private onNavigateToProduct(event: CustomEvent): void {
        console.log("Event received", event.detail);
        this.selectedProduct = event.detail.orderItem;
        this.navigateToPage(RouterPage.Product);
    }

    private renderCartPage(): TemplateResult {
        return html`<cart-page></cart-page>`;
    }


    private renderCheckoutPage(): TemplateResult {
        return html`<checkout-page></checkout-page>`;
    }


    private renderProductsInNav(): TemplateResult {
        return html`
            <div class="dropdown">
                <button>Products</button>
                <div class="dropdown-content">
                    <div class="dropdown-section">
                        <button @click=${(e: any): void => this.navigateToPage(RouterPage.Games, e)}>
                            Games
                        </button>
                    </div>
                    <div class="dropdown-section">
                        <button @click=${(e: any): void => this.navigateToPage(RouterPage.Merchandise, e)}>
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

    private renderCheckoutInNav(): any {
        if (this._currentPage === RouterPage.Cart){
        return html`<div class ="checkout"
            @click=${(_e: MouseEvent): void => this.navigateToPage(RouterPage.Checkout)}
        >
            <button>Checkout</button>
        </div>`;
    }
}


    private renderAccountInNav(): TemplateResult {
        if (!this._isLoggedIn) {
            return html``;
        }

        return html`<div @click=${(e: any): void => this.navigateToPage(RouterPage.Account, e)}>
            <button>Account</button>
        </div>`;
    }

    private renderSearchInNav(): TemplateResult {
        return html`
            <div class="search-container">
                ${this._showSearchBar
                    ? html`
                          <form @submit=${this.handleSearchSubmit}>
                              <input
                                  type="text"
                                  class="searchbar show"
                                  placeholder="Search..."
                                  @blur=${this.startHideSearchBar}
                              />
                          </form>
                      `
                    : html` <button @click=${this.showSearchBar}>Search</button> `}
            </div>
        `;
    }

    private showSearchBar(): void {
        this._showSearchBar = true;
        this.requestUpdate();
    }

    private startHideSearchBar(): void {
        this._showSearchBar = false;
        setTimeout(() => {
            this.requestUpdate();
        }, 300);
    }

    private async handleSearchSubmit(event: Event): Promise<void> {
        event.preventDefault();
        const input: HTMLInputElement | null = (event.target as HTMLFormElement).querySelector("input");
        const query: string = (input?.value || "").trim();

        if (query && query !== this._searchQuery) {
            try {
                const searchResults: OrderItem[] | undefined = await this._orderItemService.search(query);
                if (searchResults) {
                    this._searchQuery = query;
                    this._searchResults = searchResults;
                    this.navigateToPage(RouterPage.SearchResults, query, searchResults);
                } else {
                    console.error("No results found for the query:", query);
                }
            } catch (error) {
                console.error("Error during search:", error);
            }
        } else if (query) {
            this.navigateToPage(RouterPage.SearchResults, query, this._searchResults);
        }
    }


    

    private renderCartInNav(): TemplateResult {
        return html`
            <div @click=${this.clickCartButton}>
                <button
                    class="cartbuttondesign"
                    @click=${(_e: MouseEvent): void => this.navigateToPage(RouterPage.Cart)}
                >
                    <div class="cartcount">${this._cartItemsCount}</div>
                    <img class="cartimg" src="/assets/img/cartimg.png" alt="cartimg" />
                </button>
            </div>
        `;
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

                    ${this.renderEmail()} ${this.renderPassword()}
                    <div>
                        <button type="submit">Register</button>
                    </div>
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

    private renderNews(): TemplateResult {
        return html`
            <div class="news-container">
                ${this._newsItems.map(
                    (item, index) => html`
                        <div
                            class="news-item ${item.expanded ? "expanded" : ""}"
                            @click=${(): void => this.toggleNewsItem(index)}
                        >
                            <h3>${item.title}</h3>
                            <p>${item.expanded ? item.content : item.content.substring(0, 50) + "..."}</p>
                        </div>
                    `
                )}
                <div class="news-item empty">More news coming soon...</div>
            </div>
        `;
    }

    private renderAccount(): TemplateResult {
        if (!this._userProfile) {
            return html`<div>Loading...</div>`;
        }

        return html`
            <div class="profile-container">
                <h2>User Profile</h2>
                <div class="profile-item"><span>Username:</span> ${this._userProfile.username || ""}</div>
                <div class="profile-item"><span>Email:</span> ${this._userProfile.email || ""}</div>
                <div class="profile-item"><span>Date:</span> ${this._userProfile.date || ""}</div>
                <div class="profile-item"><span>Gender:</span> ${this._userProfile.gender || ""}</div>
                <div class="profile-item"><span>Street:</span> ${this._userProfile.street || ""}</div>
                <div class="profile-item">
                    <span>House Number:</span> ${this._userProfile.houseNumber || ""}
                </div>
                <div class="profile-item"><span>Country:</span> ${this._userProfile.country || ""}</div>
            </div>
        `;
    }

    private toggleNewsItem(index: number): void {
        this._newsItems = this._newsItems.map((item, i) =>
            i === index ? { ...item, expanded: !item.expanded } : item
        );
        this.requestUpdate();
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

    

    private renderAdminButton(): TemplateResult {
        if (this._isLoggedIn) {
            return html`
                <div @click=${(): void => this.navigateToPage(RouterPage.Admin)}>
                    <button>Admin</button>
                </div>
            `;
        }
        return html``;
    }
}
