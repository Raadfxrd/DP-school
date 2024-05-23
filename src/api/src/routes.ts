import { Router } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { OrderItemController } from "./controllers/OrderItemController";

export const router: Router = Router();

const userController: UserController = new UserController();
const orderItemController: OrderItemController = new OrderItemController();

router.get("/", (_, res) => {
    res.send("Hello, this is a simple webshop API.");
});

router.post("/users/register", (req, res): any => userController.register(req, res));

router.post("/users/login", (req, res): any => userController.login(req, res));

router.get("/orderItems", orderItemController.getAll);

// NOTE: Everything after this point only works with a valid JWT token!

router.use((req, res, next): any => handleTokenBasedAuthentication(req, res, next));

router.get("/users/logout", (req, res) => userController.logout(req, res));

router.get("/users/hello", (req, res) => userController.hello(req, res));

router.post("/users/cart/:id", (req, res) => userController.addOrderItemToCart(req, res));

router.get("/users/profile", (req, res): any => userController.getProfile(req, res));
