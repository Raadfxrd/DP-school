import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserData } from "@shared/types";
import { UserLoginFormModel, UserRegisterFormModel } from "@shared/formModels";
import { CustomJwtPayload } from "../types/jwt";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { queryDatabase } from "../../database/database"; // Adjust the path as needed

export class UserController {
    public async register(req: Request, res: Response): Promise<void> {
        const { name: username, email, password } = req.body as UserRegisterFormModel;

        try {
            // Check if user already exists
            const [existingUsers] = await queryDatabase<[any[], any]>("SELECT id FROM user WHERE email = ?", [
                email,
            ]);
            if (existingUsers.length > 0) {
                res.status(400).json({ message: "This email address is already used." });
                return;
            }

            // Hash the password
            const hashedPassword: string = await bcrypt.hash(password, 10);

            // Add the new user to the database
            await queryDatabase("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [
                username,
                email,
                hashedPassword,
            ]);

            res.status(201).json({ message: "Successfully registered user." });
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        const formModel: UserLoginFormModel = req.body as UserLoginFormModel;

        // Validate empty email/password
        if (!formModel.email || !formModel.password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        try {
            // Retrieve user from the database
            const [user] = await queryDatabase<[UserData[], any]>("SELECT * FROM user WHERE email = ?", [
                formModel.email,
            ]);
            if (user.length === 0) {
                res.status(400).json({ message: "User not found" });
                return;
            }

            const passwordMatch: boolean = await bcrypt.compare(formModel.password, user[0].password);

            if (!passwordMatch) {
                res.status(400).json({ message: "Incorrect password" });
                return;
            }

            // Generate a JWT Token
            const payload: CustomJwtPayload = { userId: user[0].id };
            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "1h",
            });

            res.json({ token });
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public logout(_: Request, res: Response): void {
        // Optional: revoke the JWT Token.
        res.json({ message: "You are logged out." });
    }

    public async hello(req: Request, res: Response): Promise<void> {
        const userData: UserData = req.user as UserData;

        try {
            const cartItemNames: string[] | undefined = await Promise.all(
                userData.cart?.map(async (item) => {
                    const [product] = await queryDatabase<[any[], any]>(
                        "SELECT title FROM products WHERE id = ?",
                        [item.id]
                    );
                    return product.length > 0 ? product[0].title : "Unknown item";
                }) ?? []
            );

            const response: UserHelloResponse = {
                email: userData.email,
                cartItems: cartItemNames,
            };

            res.json(response);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    public addOrderItemToCart(req: Request, res: Response): void {
        const userData: UserData = req.user as UserData;
        const id: number = parseInt(req.params.id);

        // Validate order item ID
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid order item ID" });
            return;
        }

        // Add order item to cart
        try {
            userData.cart ??= [];
            userData.cart.push({ id, amount: 1 });

            // Optionally update the user's cart in the database
            // await queryDatabase("UPDATE user SET cart = ? WHERE id = ?", [JSON.stringify(userData.cart), userData.id]);

            res.json(userData.cart.length);
        } catch (error: any) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }
}
