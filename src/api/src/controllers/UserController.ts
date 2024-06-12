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
import { UserCheckoutFormModel } from "@shared/formModels/UserCheckoutFormModel";

function escape(value: string): string {
    return mysql.escape(value);
}

export class UserController {
    public async register(req: Request, res: Response): Promise<void> {
        const { name: username, email, password } = req.body as UserRegisterFormModel;

        try {
            const escapedEmail: string = escape(email);

            const existingUsers: UserData[] = await queryDatabase<UserData[]>(
                `SELECT id FROM user WHERE email = ${escapedEmail}`
            );

            if (existingUsers.length > 0) {
                res.status(400).json({ message: "This email address is already used." });
                return;
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            await queryDatabase("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [
                username,
                email,
                hashedPassword,
            ]);

            res.status(201).json({ message: "Successfully registered user." });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body as UserLoginFormModel;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." });
            return;
        }

        try {
            const escapedEmail: string = escape(email);

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

    public hello(req: Request, res: Response): void {
        const userData: UserData = req.user;

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
            .map((e: CartItem) => orderItems.find((f: OrderItem) => f.id === e.product_id)?.title)
            .filter((title): title is string => title !== undefined);

        const response: UserHelloResponse = {
            email: userData.email,
            cartItems: cartItemNames,
        };

        res.json(response);
    }



        public async addOneToCart(req: Request, res: Response): Promise<void>{
              const userId: number = req.user.id;
            const productId: number = parseInt(req.params.id);

              if (1 === 1) {
                try {
                        const result: CartItem[] = await queryDatabase<CartItem[]>(
                            "UPDATE `cart` SET `amount` = `amount` + 1 WHERE `user_id` = ? AND `product_id` = ?", userId, productId);
                        res.json(result);
                        
                    } catch (error: any) {
                        console.error("Database Error:", error);
                        res.status(500).json({ message: "Database error", error: error.message });
                    }
            }
        }



        public async minusOneToCart(req: Request, res: Response): Promise<void>{
            const userId: number = req.user.id;
          const productId: number = parseInt(req.params.id);

            if (1 === 1) {
              try {
                      const result: CartItem[] = await queryDatabase<CartItem[]>(
                          "UPDATE `cart` SET `amount` = `amount` - 1 WHERE `user_id` = ? AND `product_id` = ?", userId, productId);
                      res.json(result);
                      
                  } catch (error: any) {
                      console.error("Database Error:", error);
                      res.status(500).json({ message: "Database error", error: error.message });
                  }
          }
      }

      public async deleteItem(req: Request, res: Response): Promise<void>{
        const userId: number = req.user.id;
      const productId: number = parseInt(req.params.id);

        if (1 === 1) {
          try {
                  const result: CartItem[] = await queryDatabase<CartItem[]>(
                      "DELETE FROM `cart` WHERE `user_id` = ? AND `product_id` = ?", userId, productId);
                  res.json(result);
                  
              } catch (error: any) {
                  console.error("Database Error:", error);
                  res.status(500).json({ message: "Database error", error: error.message });
              }
      }
  }

    public async addOrderItemToCart(req: Request, res: Response): Promise<void> {
        const userId: number = req.user.id;
        const productId: number = parseInt(req.params.id);
        const cart: CartItem[] = [];

        if (1 === 1) { 
                try{
                    const result: CartItem[] = await queryDatabase<CartItem[]>(
                        "INSERT INTO `cart`(`user_id`, `product_id`, `amount`) VALUES (?,?,'1')", userId, productId);
                    res.json(result);
                  
                } catch (error: any) {
                    console.error("Database Error:", error);
                    res.status(500).json({ message: "Database error", error: error.message });
                }
            }
        
        // Add the new item to the cart
        cart.push({ user_id: userId, product_id: productId, amount: 1, price: 5, id: productId, thumbnail: ""});

    }

    public async getItemFromCart(req: Request, res: Response): Promise<void> {
        const userId: number = req.user.id;

        // Parse the cart string if it exists, otherwise use an empty array
        if (1 === 1) {
            try {
                    const resultProductId: CartItem = await queryDatabase<CartItem>(
                        "SELECT p.*, c.amount FROM product p JOIN cart c ON p.id = c.product_id WHERE c.user_id = ?",userId);
                    res.json(resultProductId);

                } catch (error: any) {
                    console.error("Database Error:", error);
                    res.status(500).json({ message: "Database error", error: error.message });
                }
        }
        // Add the new item to the cart

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



    public async checkout(req: Request, res: Response): Promise<void> {
        const userId: number = req.user.id;
        const { date: date,  gender, street, housenumber, country } = req.body as UserCheckoutFormModel;
        try {             
            await queryDatabase("UPDATE `user` SET `timestamp` = ?, `gender` = ?, `street` = ?, `houseNumber` = ?, `country` = ? WHERE `id` = ?",
                date,
                gender,
                street,
                housenumber,
                country,
                userId );
            res.status(201).json({ message: "Successfully registered user." });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: "Database error", error: (error as Error).message });
        }
    }
}
