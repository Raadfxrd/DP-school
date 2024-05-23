import { Address } from "./Address";
import { CartItem } from "./CartItem";
import { Order } from "./Order";

export enum AuthorizationLevel {
    USER = "user",
    EMPLOYEE = "employee",
    ADMIN = "admin",
}

export type UserData = {
    id: number;
    email: string;
    password: string;
    name: string;
    username?: string;
    date?: string;
    gender?: string;
    street?: string;
    houseNumber?: string;
    country?: string;

    firstName?: string;
    lastName?: string;
    addresses?: Address[];
    orders?: Order[];
    authorizationLevel?: AuthorizationLevel;
    cart?: CartItem[];
};
