import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtToken } from "../types/jwt";
import { queryDatabase } from "../../database/database";
import { UserData } from "@shared/types";

/**
 * Handles token-based authentication. If the token is valid, the user object is added to the request object.
 * If the token is invalid, a 401 error is returned.
 *
 * @param req - Request object
 * @param res - Response object
 *
 * @returns NextFunction | Status 401
 */
export async function handleTokenBasedAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authenticationToken: string | undefined = req.headers["authorization"];

    console.log("Authentication token received:", authenticationToken);

    // Check if there is a token
    if (!authenticationToken) {
        console.log("No authentication token provided");
        res.status(401).send("Unauthorized");
        return;
    }

    // Split the Bearer token
    const tokenParts: string[] = authenticationToken.split(" ");
    if (tokenParts[0] !== "Bearer" || tokenParts.length !== 2) {
        console.log("Invalid authentication token format");
        res.status(401).send("Unauthorized");
        return;
    }

    const token: string = tokenParts[1];

    // Check if the token is valid
    let jwtToken: CustomJwtToken | undefined;

    try {
        jwtToken = jwt.verify(token, process.env.JWT_SECRET_KEY) as CustomJwtToken;
    } catch (error) {
        console.error("Invalid token", error);
        res.status(401).send("Unauthorized");
        return;
    }

    if (!jwtToken) {
        console.log("JWT token verification failed");
        res.status(401).send("Unauthorized");
        return;
    }

    console.log("JWT token verified successfully:", jwtToken);

    try {
        const users: UserData[] = await queryDatabase<UserData[]>("SELECT * FROM user WHERE id = ?", [
            jwtToken.userId,
        ]);

        if (!users || users.length === 0) {
            console.log("User not found for token", jwtToken);
            res.status(401).send("Unauthorized");
            return;
        }

        req.user = users[0];
        console.log("User authenticated", req.user);
        next();
    } catch (error) {
        console.error("Database error during user fetch", error);
        res.status(500).send("Internal Server Error");
    }
}
