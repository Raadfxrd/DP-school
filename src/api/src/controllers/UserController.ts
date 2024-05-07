import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserData } from "@shared/types";
import { UserLoginFormModel, UserRegisterFormModel } from "@shared/formModels";
import { orderItems, users } from "../fakeDatabase";
import { CustomJwtPayload } from "../types/jwt";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { queryDatabase } from "../../database/database";

/**
 * Handles all endpoints related to the User resource
 */
export class UserController {
    /**
     * Register a user using {@link UserRegisterFormModel}
     *
     * Returns a 200 with a message when successful.
     * Returns a 400 with a message detailing the reason otherwise.
     *
     * @param req Request object
     * @param res Response object
     */
    public async register(req: Request, res: Response): Promise<void> {
        const { name: username, email, password } = req.body as UserRegisterFormModel;

        // Hash het wachtwoord
        const hashedPassword: string = await bcrypt.hash(password, 10);

        // Voeg de nieuwe gebruiker toe aan de database
        await queryDatabase(
            "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
            username,
            email,
            hashedPassword
        );

        try {
            // Controleer of de gebruiker al bestaat
            const [existingUsers] = await queryDatabase<[any[], any]>("SELECT id FROM user WHERE email = ?", [
                email,
            ]);
            if (existingUsers.length > 0) {
                res.status(400).json({ message: "This email address is already used." });
                return;
            }

            res.status(201).json({ message: "Successfully registered user." });
        } catch (error: any) {
            console.error("Database Error:", error); // Voeg dit toe om de foutmelding te loggen
            res.status(500).json({ message: "Database error", error: error.message });
        }
    }

    /**
     * Login a user using a {@link UserLoginFormModel}
     *
     * Returns a 200 with a message when successful.
     * Returns a 400 with a message detailing the reason otherwise.
     *
     * @param req Request object
     * @param res Response object
     */
    public login(req: Request, res: Response): void {
        const formModel: UserLoginFormModel = req.body as UserLoginFormModel;

        // TODO: Validate empty email/password

        // Retrieve user from the fake database
        const user: UserData | undefined = users.find((u) => u.email === formModel.email);

        if (!user) {
            res.status(400).json({ message: "User not found" });

            return;
        }

        const passwordMatch: boolean = bcrypt.compareSync(formModel.password, user.password);

        if (!passwordMatch) {
            res.status(400).json({ message: "Incorrect password" });

            return;
        }

        // Generate a JWT Token
        const payload: CustomJwtPayload = { userId: user.id };

        const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
        console.log(this.generateFakeId);
    }

    /**
     * Logout a user using a valid JWT token
     *
     * Always a returns a 200 signaling success
     *
     * @param _ Request object (unused)
     * @param res Response object
     */
    public logout(_: Request, res: Response): void {
        // TODO: Optional, but revoke the JWT Token.

        res.json({
            message: "You are logged out.",
        });
    }

    /**
     * Temporary method to return some data about a user with a valid JWT token
     *
     * Always a returns a 200 with {@link UserHelloResponse} as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public hello(req: Request, res: Response): void {
        const userData: UserData = req.user!;

        const cartItemNames: string[] | undefined = userData.cart?.map(
            (e) => orderItems.find((f) => f.id === e.id)!.name
        );

        const response: UserHelloResponse = {
            email: userData.email,
            cartItems: cartItemNames,
        };

        res.json(response);
    }

    /**
     * Add a order item to the cart of the user
     *
     * Always a returns a 200 with the total number of order items in the cart as the body.
     *
     * @param req Request object
     * @param res Response object
     */
    public addOrderItemToCart(req: Request, res: Response): void {
        const userData: UserData = req.user!;
        const id: number = parseInt(req.params.id);

        // TODO: Validation

        userData.cart ??= [];
        userData.cart.push({
            id: id,
            amount: 1,
        });

        res.json(userData.cart?.length || 0);
    }

    /**
     * Generate an id for a user
     *
     * @note Do not use this method in production, it exists purely for our fake database!
     *
     * @returns Generated id
     */
    private generateFakeId(): number {
        return users.length + 1;
    }
}
