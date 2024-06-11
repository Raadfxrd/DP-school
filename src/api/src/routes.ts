import { Router, Request, Response } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { ProductController } from "./controllers/ProductController";
import { asyncHandler } from "./middlewares/asyncHandler";

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
    "/orderItems",
    asyncHandler((req: Request, res: Response) => productController.getAll(req, res))
);

router.get(
    "/orderItems/search",
    asyncHandler((req: Request, res: Response) => productController.search(req, res))
);

router.use(asyncHandler(handleTokenBasedAuthentication));

router.get(
    "/users/logout",
    asyncHandler((req: Request, res: Response) => userController.logout(req, res))
);

router.get(
    "/users/hello",
    asyncHandler((req: Request, res: Response) => userController.hello(req, res))
);

router.post(
    "/users/cart/cartinfo/:id",
    asyncHandler((req: Request, res: Response) => userController.addOrderItemToCart(req, res))
);

router.get(
    "/cart/cartinfo",
    asyncHandler((req: Request, res: Response) => userController.getItemFromCart(req, res))
);

router.get(
    "/users/profile",
    asyncHandler((req: Request, res: Response) => userController.getProfile(req, res))
);

router.post(
    "/products",
    asyncHandler((req: Request, res: Response) => productController.create(req, res))
);

router.put(
    "/products/:id",
    asyncHandler((req: Request, res: Response) => productController.update(req, res))
);

router.delete(
    "/products/:id",
    asyncHandler((req: Request, res: Response) => productController.delete(req, res))
);

export default router;
