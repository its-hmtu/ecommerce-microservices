import { Router } from "express"
import { authMiddleware } from "../middlewares"
import CartController from "../controllers/CartController"

const cartRouter = Router();

cartRouter.get('/', CartController.getCart)
cartRouter.post('/cart', CartController.updateCart)

export default cartRouter;