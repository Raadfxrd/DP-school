import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler: any =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
    (req, res, next) => {
        fn(req, res, next).catch(next);
    };
