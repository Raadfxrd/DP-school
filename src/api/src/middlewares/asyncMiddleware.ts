import { Request, Response, NextFunction } from "express";

export const asyncMiddleware: any = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): any => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(next);
    };
};
