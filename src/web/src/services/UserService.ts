import { UserLoginFormModel } from "@shared/formModels/UserLoginFormModel";
import { UserRegisterFormModel } from "@shared/formModels/UserRegisterFormModel";
import { TokenService } from "./TokenService";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { UserData } from "@shared/types/UserData";
import { CartItem } from "@shared/types";
import { UserCheckoutFormModel } from "@shared/formModels/UserCheckoutFormModel";

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

    public async checkout(formData: UserCheckoutFormModel): Promise<boolean> {
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/checkout`, {
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
            console.error("Checkout error", error);
            return false;
        }
    }


    public triggerCheckoutPage(result:number): boolean {
         if (result === 1){;
            return true;
        }
            else{
     return false;
    }
    };

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
            console.error("No token found in local storage.");
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/hello`, {
                method: "GET",
                headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText: string = await response.text();
                console.error(
                    `Error fetching welcome message: ${response.status} ${response.statusText} - ${errorText}`
                );
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

public async amountPlusOne(productId: number): Promise<any>{
    const token: string | undefined = this._tokenService.getToken();
    if (!token) {
        return undefined;
    }
    try {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/plusone/${productId}`, {
            method: "post",
            headers: { ...headers, authorization: `b ${token}`},
        });
        if (!response.ok) {
            console.error(response);
            return undefined;
        }
        return (await response.json()) as number;
    } catch (error) {
        console.error("Add one cart error", error);
        return undefined;
    }
};


public async amountMinusOne(productId: number): Promise<any>{
    const token: string | undefined = this._tokenService.getToken();
    if (!token) {
        return undefined;
    }
    try {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/minusone/${productId}`, {
            method: "post",
            headers: { ...headers, authorization: `b ${token}`},
        });
        if (!response.ok) {
            console.error(response);
            return undefined;
        }
        return (await response.json()) as number;
    } catch (error) {
        console.error("Minus one cart error", error);
        return undefined;
    }
};


public async deleteItem(productId: number): Promise<any>{
    const token: string | undefined = this._tokenService.getToken();
    if (!token) {
        return undefined;
    }
    try {
        const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/delete/${productId}`, {
            method: "post",
            headers: { ...headers, authorization: `b ${token}`},
        });
        if (!response.ok) {
            console.error(response);
            return undefined;
        }
        return (await response.json()) as number;
    } catch (error) {
        console.error("Delete item cart error", error);
        return undefined;
    }
};


    public async addOrderItemToCart(productId: number): Promise<number | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        console.log(token);
        if (!token) {
            return undefined;
        }
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/cart/cartinfo/${productId}`, {
                method: "post",
                headers: { ...headers, authorization: `b ${token}`},
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

    

    public async getItemFromCart(): Promise<Array<CartItem> | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return undefined;
        }
        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}cart/cartinfo`,  {
                method: "get",
                headers: { ...headers, Authorization: `Bearer ${token}` },                
            });
            if (response) {
                console.log(response);
            }

            if (!response.ok) {
                console.error(response);
                return undefined;
            }

            return (await response.json()) as CartItem[];
        } catch (error) {
            console.error("Get items cart error", error);
            return undefined;
        }
    }
    



    /**
     * Fetches the user's profile data. Requires a valid token.
     *
     * @returns User data when successful, otherwise `undefined`.
     */
    public async getUserProfile(): Promise<UserData | undefined> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            console.error("No token found in local storage.");
            return undefined;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/user/userinfo`,  {
                method: "GET",
                headers: { ...headers, Authorization: `Bearer ${token}` },                
            });
          
            if (!response.ok) {
                const errorText: string = await response.text();
                console.error(
                    `Error fetching user profile: ${response.status} ${response.statusText} - ${errorText}`
                );
                return undefined;
            }

            const userData: UserData = await response.json();
            console.log("User profile fetched successfully:", userData);
            return userData;
        } catch (error) {
            console.error("Get user profile error", error);
            return undefined;
        }
    }

    public async addFavorite(productId: number): Promise<boolean> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return false;
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/favorites`, {
                method: "post",
                headers: { ...headers, Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productId }),
            });

            return response.ok;
        } catch (error) {
            console.error("Add to favorites error", error);
            return false;
        }
    }

    public async getFavorites(): Promise<any[]> {
        const token: string | undefined = this._tokenService.getToken();
        if (!token) {
            return [];
        }

        try {
            const response: Response = await fetch(`${viteConfiguration.API_URL}users/favorites`, {
                method: "get",
                headers: { ...headers, Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("Error fetching favorites", response.statusText);
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching favorites", error);
            return [];
        }
    }
}
