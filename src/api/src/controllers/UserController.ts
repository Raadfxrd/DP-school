import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { CartItem, OrderItem, UserData } from "@shared/types";
import { UserLoginFormModel, UserRegisterFormModel } from "@shared/formModels";
import { CustomJwtPayload } from "../types/jwt";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { queryDatabase } from "../../database/database";
import { orderItems } from "../fakeDatabase";

// Function to escape values
function escape(value: string): string {
    return mysql.escape(value);
}

export class UserController {
    // Register a new user
    public async register(req: Request, res: Response): Promise<void> {
        const { name: username, email, password } = req.body as UserRegisterFormModel;

        try {
            // Escape the email to prevent SQL injection
            const escapedEmail: string = escape(email);

            // Check if the user already exists
            const existingUsers: UserData[] = await queryDatabase<UserData[]>(
                `SELECT id FROM user WHERE email = ${escapedEmail}`
            );

            if (existingUsers.length > 0) {
                res.status(400).json({ message: "This email address is already used." });
                return;
            }

            // Hash the user's password
            const hashedPassword: string = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            await queryDatabase(
                "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
                username,
                email,
                hashedPassword
            );

            res.status(201).json({ message: "Successfully registered user." });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    // Login an existing user
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body as UserLoginFormModel;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." });
            return;
        }

        try {
            // Escape the email to prevent SQL injection
            const escapedEmail: string = escape(email);

            // Find the user in the database
            const users: UserData[] = await queryDatabase<UserData[]>(
                `SELECT * FROM user WHERE email = ${escapedEmail}`
            );

            if (users.length === 0) {
                res.status(400).json({ message: "User not found" });
                return;
            }

            const user: UserData = users[0];

            // Compare the provided password with the stored hashed password
            const passwordMatch: boolean = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                res.status(400).json({ message: "Incorrect password" });
                return;
            }

            // Create a JWT token
            const payload: CustomJwtPayload = { userId: user.id };
            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

            res.json({ token });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    // Logout the user
    public logout(_: Request, res: Response): void {
        res.json({ message: "You are logged out." });
    }

    public async deleteAccount(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).send("Unauthorized");
            return;
        }

        const userId: number = req.user.id;

        try {
            // Verwijder eerst alle gerelateerde records in de 'favorites' tabel
            await queryDatabase("DELETE FROM favorites WHERE user_id = ?", userId);

            // Verwijder de gebruiker uit de database
            await queryDatabase("DELETE FROM user WHERE id = ?", userId);

            res.status(200).json({ message: "Account succesvol verwijderd." });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    public hello(req: Request, res: Response): void {
        const userData: UserData = req.user!;

        let cartItems: CartItem[] = [];

        // Parse the cart string if it exists
        if (userData.cart) {
            try {
                cartItems = JSON.parse(userData.cart);
            } catch (error) {
                console.error("Error parsing cart:", error);
                res.status(500).json({ message: "Error processing cart data" });
                return;
            }
        }

        // Get the titles of the items in the cart
        const cartItemNames: string[] | undefined = cartItems
            .map((e: CartItem) => orderItems.find((f: OrderItem) => f.id === e.id)?.title)
            .filter((title): title is string => title !== undefined);

        const response: UserHelloResponse = {
            email: userData.email,
            cartItems: cartItemNames,
        };

        res.json(response);
    }

    // Add an item to the user's cart
    public async addOrderItemToCart(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user!;
        const id: number = parseInt(req.params.id);

        let cart: CartItem[] = [];

        // Parse the cart string if it exists, otherwise use an empty array
        if (userData.cart) {
            try {
                cart = JSON.parse(userData.cart);
            } catch (error) {
                console.error("Error parsing cart:", error);
                res.status(500).json({ message: "Error processing cart data" });
                return;
            }
        }

        // Add the new item to the cart
        cart.push({ id, amount: 1 });

        // Stringify the cart array to store it back in the database
        const cartString: string = JSON.stringify(cart);

        try {
            // Update the user's cart in the database
            await queryDatabase("UPDATE user SET cart = ? WHERE id = ?", [cartString, userData.id]);
            res.json(cart.length);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).send("Unauthorized");
            return;
        }

        const userId: number = req.user.id;
        const updatedData: Partial<UserData> = req.body;

        try {
            // Validatie van de data in updatedData
            const allowedFields: (keyof UserData)[] = [
                "username",
                "email",
                "date",
                "gender",
                "street",
                "houseNumber",
                "country",
            ];
            const fields: string[] = [];
            const values: any[] = [];

            for (const [key, value] of Object.entries(updatedData)) {
                if (allowedFields.includes(key as keyof UserData) && value !== null && value !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (fields.length === 0) {
                res.status(400).json({ message: "No valid fields to update." });
                return;
            }

            const query: string = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
            values.push(userId);

            // Debugging: Log query en values
            console.log("Query:", query);
            console.log("Values:", values);

            await queryDatabase(query, ...values); // Let op de spread operator hier
            res.status(200).json({ message: "Profile successfully updated." });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    // Get the user's profile
    public async getProfile(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).send("Unauthorized");
            return;
        }

        const userId: number = req.user.id;

        try {
            // Retrieve the user's profile from the database
            const userProfile: UserData[] = await queryDatabase<UserData[]>(
                "SELECT username, email, date, gender, street, houseNumber, country FROM user WHERE id = ?",
                userId
            );

            if (userProfile.length === 0) {
                res.status(404).send("User not found");
                return;
            }

            console.log("User Profile:", userProfile[0]);

            res.json(userProfile[0]);
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }
}
