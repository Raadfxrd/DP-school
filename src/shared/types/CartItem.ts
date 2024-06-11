export type CartItem = {
    product_id: number;
    user_id: number;
    amount: number;
    id?: number;
    title?: string;
    thumbnail?: string;
    images?: string[];
    description?: string;
    authors?: string[];
    tags?: string[];
    price: number;
};
