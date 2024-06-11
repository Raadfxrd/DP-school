import { product } from "./OrderItem";

export type Order = {
    id: number;
    products: product[];
    status: string;
};
