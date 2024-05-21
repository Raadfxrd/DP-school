import { Router, Request, Response } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { ProductController } from "./controllers/ProductController";
import { asyncHandler } from "./middlewares/asyncHandler";
import { asyncMiddleware } from "./middlewares/asyncMiddleware";

export const router: Router = Router();

const userController: UserController = new UserController();
const productController: ProductController = new ProductController();

router.get("/", (_, res: Response) => {
    res.send("Hello, this is a simple webshop API.");
    console.log("Root route accessed");
});

router.post(
    "/users/register",
    asyncHandler((req: Request, res: Response) => userController.register(req, res))
);
router.post(
    "/users/login",
    asyncHandler((req: Request, res: Response) => userController.login(req, res))
);

router.get(
    "/products",
    asyncHandler((req: Request, res: Response) => productController.getAll(req, res))
);

// Apply authentication middleware to routes that require it
router.use(asyncMiddleware(handleTokenBasedAuthentication));

router.get(
    "/users/logout",
    asyncHandler((req: Request, res: Response) => userController.logout(req, res))
);
router.get(
    "/users/hello",
    asyncHandler((req: Request, res: Response) => userController.hello(req, res))
);
router.post(
    "/users/cart/:id",
    asyncHandler((req: Request, res: Response) => userController.addOrderItemToCart(req, res))
);

export default router;
