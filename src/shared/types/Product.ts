export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    url: string;
    type: "game" | "merch";
    tags: { tag: string }[];
    authors: { name: string }[];
    images: { url: string }[];
}
