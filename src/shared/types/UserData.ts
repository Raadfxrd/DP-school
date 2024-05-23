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
    username?: string; // Voeg username toe
    date?: string; // Voeg date toe
    gender?: string; // Voeg gender toe
    street?: string; // Voeg street toe
    houseNumber?: string; // Voeg houseNumber toe
    country?: string; // Voeg country toe

    firstName?: string;
    lastName?: string;
    addresses?: Address[];
    orders?: Order[];
    authorizationLevel?: AuthorizationLevel;
    cart?: CartItem[];
};
