import { Router, Request, Response } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { ProductController } from "./controllers/ProductController";
import { FavoriteController } from "./controllers/FavoriteController";
import { asyncHandler } from "./middlewares/asyncHandler";
import { MerchandiseController } from "./controllers/MerchandiseController";
import { GamesController } from "./controllers/GamesController";
import { asyncMiddleware } from "./middlewares/asyncMiddleware";

export const router: Router = Router();

const userController: UserController = new UserController();
const productController: ProductController = new ProductController();
const favoriteController: FavoriteController = new FavoriteController();
const merchandiseController: MerchandiseController = new MerchandiseController();
const gamesController: GamesController = new GamesController();

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
    "/merchandise",
    asyncHandler((req: Request, res: Response) => merchandiseController.getMerchandise(req, res))
);

router.get(
    "/Game",
    asyncHandler((req: Request, res: Response) => gamesController.getGames(req, res))
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
    "/users/cart/plusone/:id",
    asyncHandler((req: Request, res: Response) => userController.addOneToCart(req, res))
);

router.post(
    "/users/cart/minusone/:id",
    asyncHandler((req: Request, res: Response) => userController.minusOneToCart(req, res))
);

router.post(
    "/users/cart/delete/:id",
    asyncHandler((req: Request, res: Response) => userController.deleteItem(req, res))
);

router.post(
    "/users/cart/cartinfo/:id",
    asyncHandler((req: Request, res: Response) => userController.addOrderItemToCart(req, res))
);

router.post(
    "/users/cart/checkout",
    asyncHandler((req: Request, res: Response) => userController.checkout(req, res))
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
    "/users/favorites",
    asyncHandler((req: Request, res: Response) => favoriteController.addFavorite(req, res))
);

router.get(
    "/users/favorites",
    asyncHandler((req: Request, res: Response) => favoriteController.getFavorites(req, res))
);

router.delete(
    "/users/delete",
    asyncHandler((req: Request, res: Response) => userController.deleteAccount(req, res))
);

router.put(
    "/users/updateProfile",
    asyncHandler((req: Request, res: Response) => userController.updateProfile(req, res))
);

export default router;
