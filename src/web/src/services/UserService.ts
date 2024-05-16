import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
import { TokenService } from "./TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";

const headers: { "Content-Type": string } = {
    "Content-Type": "application/json",
};

/**
 * Handles user related functionality
 */
export class UserService {
    private _tokenService: TokenService = new TokenService();

    /**
     * Handles user login
     *
     * @param formData - Data to use during login
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async login(formData: UserLoginFormModel): Promise<boolean> {
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/login`, {
                method: "post",
                headers: headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error(response);
                return false;
            }

            const json: { token: string | undefined } = await response.json();

            if (json.token) {
                this._tokenService.setToken(json.token);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Login error", error);
            return false;
        }
    }

    /**
     * Handles user registration
     *
     * @param formData - Data to use during registration
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async register(formData: UserRegisterFormModel): Promise<boolean> {
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/register`, {
                method: "post",
                headers: headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error(response);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Registration error", error);
            return false;
        }
    }

    /**
     * Handles user logout
     *
     * @returns `true` when successful, otherwise `false`.
     */
    public async logout(): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return false;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/logout`, {
                method: "get",
                headers: { ...headers, Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error(response);
                return false;
            }

            this._tokenService.removeToken();
            return true;
        } catch (error) {
            console.error("Logout error", error);
            return false;
        }
    }

    /**
     * Handles user welcome message containing user and cart data. Requires a valid token.
     *
     * @returns Object with user and cart data when successful, otherwise `undefined`.
     */
    public async getWelcome(): Promise<UserHelloResponse | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/hello`, {
                method: "get",
                headers: { ...headers, Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            return (await response.json()) as UserHelloResponse;
        } catch (error) {
            console.error("Get welcome error", error);
            return undefined;
        }
    }

    /**
     * Handles adding an order item to the cart of the current user. Requires a valid token.
     *
     * @returns Current number of order items in the cart when successful, otherwise `false`.
     */
    public async addOrderItemToCart(id: number): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();

        if (!token) {
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/${id}`, {
                method: "post",
                headers: { ...headers, Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            return (await response.json()) as number;
        } catch (error) {
            console.error("Add to cart error", error);
            return undefined;
        }
    }
}
