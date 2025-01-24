import { Router } from "express"
import { authMiddleware } from "../middlewares"
import CartController from "../controllers/CartController"

const cartRouter = Router();

cartRouter.get('/:userId', authMiddleware, CartController.getCart)
cartRouter.post('/', authMiddleware, CartController.updateCart)
cartRouter.delete('/:userId', authMiddleware, CartController.emptyCart)

export default cartRouter;