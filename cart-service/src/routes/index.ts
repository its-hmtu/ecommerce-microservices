import { Router } from "express"
import { authMiddleware } from "../middlewares"
import CartController from "../controllers/CartController"

const cartRouter = Router();

cartRouter.get('/cart', authMiddleware, CartController.getCart)
cartRouter.post('/cart', authMiddleware, CartController.updateCart)

export default cartRouter;