import { Router } from "express"
import { authMiddleware } from "../middlewares"
import OrderController from "../controllers/OrderController";

const orderRouter = Router();

orderRouter.post('/', authMiddleware, OrderController.createOrder)
orderRouter.get('/', authMiddleware, OrderController.getOrders)

export default orderRouter;