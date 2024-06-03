/**
 * This file represents a database with two tables: User and OrderItem.
 *
 * It should be noted that this fake database does not directly translate to an actual relational database.
 */
import { OrderItem, UserData } from "@shared/types";



/**
 * User table
 */
export const users: UserData[] = [
    {
        id: 1,
        email: "test@test.nl",
        name: "test",
        password: "$2b$10$GCObbpQrqu1kuaKex6aW8e4SnmC6w8ykffdvLStHNCFq8QECGMzBW", // test
    },
];

/**
 * Order item table
 */
export const orderItems: OrderItem[] = [
    {
        id: 1,
        title: "Item 1",
        description: "Description 1",
        price: 10,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 2,
        title: "Item 2",
        description: "Description 2",
        price: 20,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 3,
        title: "Item 3",
        description: "Description 3",
        price: 30,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 4,
        title: "Item 4",
        description: "Description 4",
        price: 40,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 5,
        title: "Item 5",
        description: "Description 5",
        price: 50,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 6,
        title: "Item 6",
        description: "Description 6",
        price: 60,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
];

/**
 * Merchandise table
 */
export const merchandise: OrderItem[] = [
    {
        id: 1,
        title: "Item 1",
        description: "Description 1",
        price: 10,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 2,
        title: "Item 2",
        description: "Description 2",
        price: 20,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 3,
        title: "Item 3",
        description: "Description 3",
        price: 30,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 4,
        title: "Item 4",
        description: "Description 4",
        price: 40,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 5,
        title: "Item 5",
        description: "Description 5",
        price: 50,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 6,
        title: "Item 6",
        description: "Description 6",
        price: 60,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
];

/**
 * Games table
 */
export const games: OrderItem[] = [
    {
        id: 1,
        title: "Item 1",
        description: "Description 1",
        price: 10,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 2,
        title: "Item 2",
        description: "Description 2",
        price: 20,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 3,
        title: "Item 3",
        description: "Description 3",
        price: 30,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 4,
        title: "Item 4",
        description: "Description 4",
        price: 40,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 5,
        title: "Item 5",
        description: "Description 5",
        price: 50,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
    {
        id: 6,
        title: "Item 6",
        description: "Description 6",
        price: 60,
        imageURLs: ["https://via.placeholder.com/450"],
        quantity:1
    },
];
