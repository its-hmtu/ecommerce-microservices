import { Router } from "express"
import { authMiddleware } from "../middlewares"
import CartController from "../controllers/CartController"

const cartRouter = Router();

cartRouter.get('/:userId', CartController.getCart)
cartRouter.post('/', CartController.updateCart)
cartRouter.delete('/:userId', CartController.emptyCart)

export default cartRouter;