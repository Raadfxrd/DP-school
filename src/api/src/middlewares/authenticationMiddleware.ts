import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtToken } from "../types/jwt";
import { getUserById } from "../../database/database";
import { UserData } from "@shared/types";

export async function handleTokenBasedAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<NextFunction | void> {
    console.log("Authentication Middleware Triggered");

    const authenticationToken: string | undefined = req.headers["authorization"];

    if (!authenticationToken) {
        console.log("No token provided");
        res.status(401).send("Unauthorized");
        return;
    }

    let jwtToken: CustomJwtToken | undefined;

    try {
        jwtToken = jwt.verify(authenticationToken, process.env.JWT_SECRET_KEY) as CustomJwtToken;
        console.log("Token is valid");
    } catch {
        console.log("Invalid token");
        res.status(401).send("Unauthorized");
        return;
    }

    // Retrieve user from the real database
    const user: UserData | null = await getUserById(jwtToken.userId);

    if (!user) {
        console.log("User not found");
        res.status(401).send("Unauthorized");
        return;
    }

    req.user = user;

    return next();
}
