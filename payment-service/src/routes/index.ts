import { Router } from "express"
import { authMiddleware } from "../middlewares"
import PaymentController from "../controllers/PaymentController"
const paymentRouter = Router();

paymentRouter.post("/", PaymentController.createPayment)

export default paymentRouter;